import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Collapsible } from '@/components/ui/collapsible'
import { DEFAULT_USER_IMAGE } from '@/constants/images'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/services/authService'
import { supabase } from '@/services/supabase'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as Clipboard from 'expo-clipboard'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Share, TouchableOpacity, View } from 'react-native'

interface FamilyData {
  id: string
  name: string
  description: string | null
  invite_code: string
  creator_id: string
  created_at: string
}

const Settings = () => {
  const { userProfile } = useAuth()
  const [familyData, setFamilyData] = useState<FamilyData | null>(null)
  const [familyStats, setFamilyStats] = useState({ members: 0, notes: 0 })
  const [loggingOut, setLoggingOut] = useState(false)

  const isAdmin = userProfile && familyData && userProfile.id === familyData.creator_id

  useEffect(() => {
    const fetchFamilyData = async () => {
      if (!userProfile?.family_id) {
        return
      }

      try {
        // Fetch family data
        const { data: family, error: familyError } = await supabase
          .from('family')
          .select('*')
          .eq('id', userProfile.family_id)
          .single()

        if (familyError) {
          console.error('Error fetching family:', familyError)
        } else {
          setFamilyData(family)
        }

        // Fetch family stats
        const [membersResult, notesResult] = await Promise.all([
          supabase
            .from('user')
            .select('id', { count: 'exact', head: true })
            .eq('family_id', userProfile.family_id),
          supabase
            .from('note')
            .select('id', { count: 'exact', head: true })
            .eq('family_id', userProfile.family_id)
        ])

        setFamilyStats({
          members: membersResult.count || 0,
          notes: notesResult.count || 0
        })
      } catch (error) {
        console.error('Error fetching family data:', error)
      }
    }

    fetchFamilyData()
  }, [userProfile?.family_id])

  const handleCopyCode = async () => {
    if (familyData?.invite_code) {
      await Clipboard.setStringAsync(familyData.invite_code)
      Alert.alert('Copied!', 'Invite code copied to clipboard')
    }
  }

  const handleShareCode = async () => {
    if (familyData?.invite_code) {
      try {
        await Share.share({
          message: `Join our family on FamNote! Use this code: ${familyData.invite_code}`
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true)
            const { error } = await signOut()
            setLoggingOut(false)
            
            if (error) {
              Alert.alert('Error', error)
            } else {
              // Navigation will be handled by AuthContext
              router.replace('/(auth)/login')
            }
          }
        }
      ]
    )
  }

  if (!userProfile) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0F9E99" />
      </ThemedView>
    )
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
        <View className="px-5 mb-4">
          <ThemedText type="title" className="font-bold text-white">
            Settings
          </ThemedText>
        </View>
        
        <View className="flex-row items-center px-5">
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 2,
              borderColor: 'white',
            }}
            source={userProfile?.image ? { uri: userProfile.image } : DEFAULT_USER_IMAGE}
          />
          <View className="ml-3">
            <ThemedText className="text-base font-bold text-white">
              {userProfile?.username || 'User'}
            </ThemedText>
            <ThemedText className="text-sm text-white opacity-90">
              {userProfile?.email || ''}
            </ThemedText>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 bg-backgroundV2" showsVerticalScrollIndicator={false}>
        <View className="gap-4 p-5">
          {/* Family Info Collapsible */}
          {isAdmin && familyData ? (
            <Collapsible title="Family Admin">
              <View className="gap-4">
                {/* Joining Code */}
                <View className="gap-2">
                  <ThemedText className="text-sm font-semibold text-text">
                    Family Invite Code
                  </ThemedText>
                  <View className="flex-row gap-2 items-center">
                    <View className="flex-1 p-3 bg-gray-100 rounded-lg">
                      <ThemedText className="font-mono text-lg text-center text-primary">
                        {familyData.invite_code}
                      </ThemedText>
                    </View>
                    <TouchableOpacity
                      onPress={handleCopyCode}
                      className="p-3 rounded-lg bg-primary"
                    >
                      <AntDesign name="copy" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleShareCode}
                      className="p-3 rounded-lg bg-primary"
                    >
                      <AntDesign name="export" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Stats */}
                <View className="gap-2">
                  <ThemedText className="text-sm font-semibold text-text">
                    Family Statistics
                  </ThemedText>
                  <View className="flex-row gap-3">
                    <View className="flex-1 p-4 bg-white rounded-xl border border-gray-200">
                      <ThemedText className="text-2xl font-bold text-center text-primary">
                        {familyStats.members}
                      </ThemedText>
                      <ThemedText className="mt-1 text-xs text-center text-muted">
                        Members
                      </ThemedText>
                    </View>
                    <View className="flex-1 p-4 bg-white rounded-xl border border-gray-200">
                      <ThemedText className="text-2xl font-bold text-center text-primary">
                        {familyStats.notes}
                      </ThemedText>
                      <ThemedText className="mt-1 text-xs text-center text-muted">
                        Notes
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </Collapsible>
          ) : (
            <Collapsible title="Family Info">
              <ThemedText className="text-sm text-muted">
                {familyData ? `You are a member of ${familyData.name}` : 'Loading family information...'}
              </ThemedText>
            </Collapsible>
          )}

          {/* App Info */}
          <Collapsible title="About FamNote">
            <ThemedText className="text-sm text-muted">
              FamNote helps families stay connected by sharing notes, memories, and moments together.
            </ThemedText>
          </Collapsible>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={loggingOut}
            className="flex-row gap-3 items-center justify-center p-4 mt-4 bg-red-50 rounded-xl border border-red-200"
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color="#DC2626" />
            ) : (
              <AntDesign name="logout" size={20} color="#DC2626" />
            )}
            <ThemedText className="text-base font-semibold" style={{ color: '#DC2626' }}>
              {loggingOut ? 'Logging out...' : 'Logout'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  )
}

export default Settings