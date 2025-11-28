import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { categories } from "@/constants/categories";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/hooks/useNotes";
import { supabase } from "@/services/supabase";
import type { NoteWithUser } from "@/types/note.types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";

// Helper function to format date
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

// Helper function to get category by type
const getCategoryByType = (type: string | null) => {
  if (!type) return categories[4]; // Default to 'update'
  return categories.find(cat => cat.id === type) || categories[4];
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [loadingFamily, setLoadingFamily] = useState(true);
  const { notes, loading: loadingNotes, error, refreshNotes } = useNotes(familyId);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user's family_id from Supabase
  useEffect(() => {
    const fetchUserFamily = async () => {
      if (!user?.uid) {
        setLoadingFamily(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('user')
          .select('family_id')
          .eq('id', user.uid)
          .single();

        if (fetchError) {
          console.error('Error fetching user family:', fetchError);
          setFamilyId(null);
        } else {
          setFamilyId(data?.family_id || null);
        }
      } catch (error) {
        console.error('Error fetching user family:', error);
        setFamilyId(null);
      } finally {
        setLoadingFamily(false);
      }
    };

    fetchUserFamily();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNotes();
    setRefreshing(false);
  };

  // Redirect to onboarding if no family
  useEffect(() => {
    if (!loadingFamily && !familyId && user) {
      router.replace('/(onboarding)');
    }
  }, [loadingFamily, familyId, user]);

  if (loadingFamily) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0F9E99" />
      </ThemedView>
    );
  }

  if (!familyId) {
    return (
      <ThemedView className="flex-1 justify-center items-center p-5">
        <ActivityIndicator size="large" color="#0F9E99" />
        <ThemedText className="mt-4 text-center text-muted">
          Redirecting to onboarding...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="relative flex-1">
      <FamNoteHeader familyId={familyId} />
      <ScrollView
        className="flex-1 p-8 bg-backgroundV2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loadingNotes ? (
          <ThemedView className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#0F9E99" />
          </ThemedView>
        ) : error ? (
          <ThemedView className="flex-1 justify-center items-center py-20">
            <ThemedText className="text-center text-muted mb-4">
              {error}
            </ThemedText>
            <TouchableOpacity
              onPress={handleRefresh}
              className="px-4 py-2 rounded-full bg-primary"
            >
              <ThemedText className="text-white">Retry</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : notes.length === 0 ? (
          <ThemedView className="flex-1 justify-center items-center py-20">
            <ThemedText type="title" className="mb-2 text-center">
              No Notes Yet
            </ThemedText>
            <ThemedText className="text-center text-muted">
              Start sharing moments with your family!
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView className="gap-5 mb-14">
            {notes.map((note: NoteWithUser) => {
              const category = getCategoryByType(note.type);
              return (
                <View
                  key={note.id}
                  className="gap-2 p-5 rounded-3xl shadow-primary"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row gap-2 items-center">
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          borderWidth: 3,
                          borderColor: "#fff",
                        }}
                        source={{
                          uri: note.user?.image || "https://blog.logrocket.com/wp-content/uploads/2024/01/react-native-navigation-tutorial.png",
                        }}
                      />
                      <View>
                        <ThemedText 
                          type="subtitle" 
                          className="font-medium"
                          style={{ color: category.textColor }}
                        >
                          {note.user?.username || 'Unknown'}
                        </ThemedText>
                        <ThemedText className="text-sm opacity-60 text-muted">
                          {formatTimeAgo(note.created_at)}
                        </ThemedText>
                      </View>
                    </View>
                    {note.type && (
                      <View className="px-3 py-1 rounded-full" style={{ backgroundColor: category.textColor + '20' }}>
                        <ThemedText 
                          className="text-xs font-medium"
                          style={{ color: category.textColor }}
                        >
                          {category.label}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  {note.emoji && (
                    <View className="flex-row gap-2 items-center py-1" style={{ overflow: 'visible' }}>
                      <ThemedText style={{ fontSize: 32, lineHeight: 32 }}>{note.emoji}</ThemedText>
                    </View>
                  )}
                  <ThemedText className="text-base text-text">
                    {note.text}
                  </ThemedText>
                  {note.image && (
                    <Image
                      source={{ uri: note.image }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 12,
                        marginTop: 8,
                      }}
                      contentFit="cover"
                    />
                  )}
                </View>
              );
            })}
          </ThemedView>
        )}
      </ScrollView>
      <TouchableOpacity 
        className="absolute right-4 bottom-4 p-4 rounded-full bg-primary"
        onPress={() => router.push("/modal")}
      >
        <AntDesign name="plus" size={18} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const FamNoteHeader = ({ familyId }: { familyId: string | null }) => {
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!familyId) {
        setLoadingMembers(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user')
          .select('id, username, image')
          .eq('family_id', familyId);

        if (error) {
          console.error('Error fetching family members:', error);
          setFamilyMembers([]);
        } else {
          setFamilyMembers(data || []);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
        setFamilyMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchFamilyMembers();
  }, [familyId]);

  return (
    <ThemedView className="pt-8 pb-2 bg-white">
      <ThemedView className="flex-row justify-between items-start px-5 bg-transparent">
        <ThemedView>
          <ThemedText type="subtitle" className="font-medium">
            FamNote
          </ThemedText>
          <ThemedText className="text-sm text-muted">
            Sharing moments together
          </ThemedText>
        </ThemedView>
        <Pressable
          onPress={() => router.push("/modal")}
          className="flex-row gap-3 items-center p-2 px-4 rounded-full bg-primary"
        >
          <AntDesign name="plus" size={14} color="white" />
          <ThemedText className="text-white">Add Note</ThemedText>
        </Pressable>
      </ThemedView>
      {!loadingMembers && familyMembers.length > 0 && (
        <ScrollView
          horizontal
          className="mt-2"
          showsHorizontalScrollIndicator={false}
        >
          {familyMembers.map((member) => (
            <ThemedView key={member.id} className="justify-center items-center mx-4 mt-2">
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: "#0F9E99",
                }}
                source={{
                  uri: member.image || "https://blog.logrocket.com/wp-content/uploads/2024/01/react-native-navigation-tutorial.png",
                }}
              />
              <ThemedText className="text-xs text-text">{member.username || 'User'}</ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
};
