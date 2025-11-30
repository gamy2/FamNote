import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { categories } from '@/constants/categories';
import { DEFAULT_USER_IMAGE } from '@/constants/images';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/services/supabase';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, View } from 'react-native';

interface FamilyMember {
  id: string;
  username: string;
  email: string;
  image: string | null;
  noteCount: number;
}

export default function FamilyScreen() {
  const { userProfile } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!userProfile?.family_id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch family members
        const { data: membersData, error: membersError } = await supabase
          .from('user')
          .select('id, username, email, image')
          .eq('family_id', userProfile.family_id);

        if (membersError) {
          console.error('Error fetching members:', membersError);
          setLoading(false);
          return;
        }

        // Fetch note counts for each member
        const membersWithCounts = await Promise.all(
          (membersData || []).map(async (member) => {
            const { count } = await supabase
              .from('note')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', member.id);

            return {
              ...member,
              noteCount: count || 0,
            };
          })
        );

        setMembers(membersWithCounts);
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [userProfile?.family_id]);

  // Get color for member card (cycle through category colors)
  const getCardColor = (index: number) => {
    return categories[index % categories.length];
  };

  if (!userProfile) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0F9E99" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-backgroundV2">
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#0F9E99', '#0A7A76']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-12 pb-6"
      >
        <View className="px-5">
          <ThemedText type="title" className="font-bold text-white">
            Family
          </ThemedText>
          <ThemedText className="text-sm text-white opacity-90 mt-1">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1 bg-backgroundV2" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#0F9E99" />
          </View>
        ) : members.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <ThemedText type="title" className="mb-2 text-center">
              No Family Members
            </ThemedText>
            <ThemedText className="text-center text-muted">
              Invite family members to get started!
            </ThemedText>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {members.map((member, index) => {
              const cardColor = getCardColor(index);
              const screenWidth = Dimensions.get('window').width;
              const cardWidth = (screenWidth - 48) / 2; // 2 columns with padding

              return (
                <View
                  key={member.id}
                  className="rounded-3xl p-5 mb-4"
                  style={{
                    backgroundColor: cardColor.bgColor,
                    width: cardWidth,
                  }}
                >
                  {/* Avatar */}
                  <View className="items-center mb-3">
                    <Image
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        borderWidth: 4,
                        borderColor: 'white',
                      }}
                      source={member.image ? { uri: member.image } : DEFAULT_USER_IMAGE}
                    />
                  </View>

                  {/* Username */}
                  <ThemedText 
                    className="text-center font-bold text-base mb-1"
                    style={{ color: cardColor.textColor }}
                    numberOfLines={1}
                  >
                    {member.username}
                  </ThemedText>

                  {/* Role/Email - first part before @ */}
                  <ThemedText 
                    className="text-center text-xs mb-3 opacity-70"
                    style={{ color: cardColor.textColor }}
                    numberOfLines={1}
                  >
                    {member.email.split('@')[0]}
                  </ThemedText>

                  {/* Note Count */}
                  <View 
                    className="py-2 px-3 rounded-full"
                    style={{ 
                      backgroundColor: cardColor.textColor + '20',
                      alignSelf: 'center',
                    }}
                  >
                    <ThemedText 
                      className="text-xs font-semibold"
                      style={{ color: cardColor.textColor }}
                    >
                      {member.noteCount} {member.noteCount === 1 ? 'note' : 'notes'}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
