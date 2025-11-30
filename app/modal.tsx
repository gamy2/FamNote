import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { categories, emojis } from '@/constants/categories';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateNote } from '@/hooks/useCreateNote';


// Animated Emoji Button Component
const AnimatedEmojiButton = ({ 
  emoji, 
  index, 
  onPress 
}: { 
  emoji: string; 
  index: number; 
  onPress: () => void;
}) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-180);
  const pressed = useSharedValue(0); // 0 = not pressed, 1 = pressed

  useEffect(() => {
    scale.value = withDelay(index * 15, withSpring(1, { damping: 12, stiffness: 200 }));
    rotation.value = withDelay(index * 15, withSpring(0, { damping: 12, stiffness: 200 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value + (pressed.value * 0.2) }, // Scale up by 0.2 when pressed
        { rotate: `${rotation.value + (pressed.value * 15)}deg` }, // Rotate 15deg when pressed
      ],
    };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 10, stiffness: 200 });
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 15).duration(200)}
      exiting={FadeOut.duration(150)}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="justify-center items-center w-12 h-12 bg-gray-50 rounded-lg active:bg-gray-200"
      >
        <ThemedText className="text-2xl">{emoji}</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Animated Picker Button Component
const AnimatedPickerButton = ({ 
  selectedEmoji, 
  onPress 
}: { 
  selectedEmoji: string | null; 
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0); // 0 = not pressed, 1 = pressed

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value - (pressed.value * 0.05) }], // Scale down by 0.05 when pressed
    };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 10, stiffness: 200 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-row gap-2 justify-center items-center p-4 bg-gray-100 rounded-xl border border-gray-200"
      >
        {selectedEmoji ? (
          <ThemedText className="text-2xl">{selectedEmoji}</ThemedText>
        ) : (
          <>
            <ThemedText className="text-lg">😊</ThemedText>
            <ThemedText className="text-sm text-text">Pick emoji</ThemedText>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ModalScreen() {
  const { user, userProfile } = useAuth();
  const { loading, error, createNoteWithImage, pickImage } = useCreateNote();
  
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setSelectedImageUri(uri);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUri(null);
  };

  const handleSave = async () => {
    // Validate inputs
    if (!noteText.trim()) {
      Alert.alert('Validation Error', 'Please enter some text for your note');
      return;
    }

    if (!user?.uid || !userProfile?.family_id) {
      Alert.alert('Error', 'User or family information not found');
      return;
    }

    // Create note
    const success = await createNoteWithImage(user.uid, userProfile.family_id, {
      text: noteText,
      emoji: selectedEmoji,
      type: selectedCategory as any,
      imageUri: selectedImageUri,
    });

    if (success) {
      // Navigate back first to trigger refresh
      router.back();
      // Show success message after navigation
      setTimeout(() => {
        Alert.alert('Success', 'Note shared with your family!');
      }, 100);
    } else if (error) {
      Alert.alert('Error', error);
    }
  };

  const handleCancel = () => {
    if (noteText.trim() || selectedImageUri) {
      Alert.alert(
        'Discard Note?',
        'Are you sure you want to discard this note?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  if (!userProfile) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0F9E99" />
      </ThemedView>
    );
  }


  return (
    <ThemedView className="flex-1 bg-background">
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#0F9E99', '#0A7A76']} // Gradient from primary to darker teal
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-12 pb-6"
      >
        <View className="flex-row justify-between items-start px-5 mb-4">
          <ThemedText type="title" className="font-bold text-white">
            Create a Note
          </ThemedText>
          <TouchableOpacity onPress={handleCancel} disabled={loading}>
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
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
            source={{
              uri: userProfile?.image || "https://blog.logrocket.com/wp-content/uploads/2024/01/react-native-navigation-tutorial.png",
            }}
          />
          <View className="ml-3">
            <ThemedText className="text-base font-bold text-white">
              {userProfile?.username || 'User'}
            </ThemedText>
            <ThemedText className="text-sm text-white opacity-90">
              Posting to family
            </ThemedText>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="gap-6 p-5">
          {/* Add Emoji Section */}
          <View>
            <ThemedText className="mb-2 text-sm font-medium text-text">
              Add an emoji (optional)
            </ThemedText>
            <View className="flex-row flex-wrap gap-2 items-center">
              {showEmojiPicker ? (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(150)}
                  className="flex-row flex-wrap gap-3 w-full"
                >
                  {emojis.map((emoji, index) => (
                    <AnimatedEmojiButton
                      key={emoji}
                      emoji={emoji}
                      index={index}
                      onPress={() => {
                        setSelectedEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  ))}
                </Animated.View>
              ) : (
                <AnimatedPickerButton
                  selectedEmoji={selectedEmoji}
                  onPress={() => setShowEmojiPicker(true)}
                />
              )}
            </View>
            {selectedEmoji && !showEmojiPicker && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedEmoji(null);
                }}
                className="mt-2"
              >
                <ThemedText className="text-sm text-center text-primary">
                  Remove emoji
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Category Section */}
          <View>
            <ThemedText className="mb-3 text-sm font-medium text-text">
              Category
            </ThemedText>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: selectedCategory === category.id 
                      ? category.bgColor 
                      : `${category.bgColor}40`, // 40% opacity when not selected
                    borderWidth: selectedCategory === category.id ? 2 : 1,
                    borderColor: selectedCategory === category.id 
                      ? category.bgColor 
                      : category.bgColor,
                  }}
                >
                  <ThemedText 
                    className="text-sm font-medium"
                    style={{
                      color: category.textColor
                    }}
                  >
                    {category.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* What's on your mind Section */}
          <View>
            <ThemedText className="mb-2 text-sm font-medium text-text">
              What&apos;s on your mind?
            </ThemedText>
            <TextInput
              className="min-h-[150px] p-4 bg-gray-50 rounded-2xl text-text border border-gray-200"
              multiline
              placeholder="Share a moment, reminder, or thought with your family&hellip;"
              placeholderTextColor="#999"
              value={noteText}
              onChangeText={setNoteText}
              textAlignVertical="top"
              style={{
                fontSize: 16,
                lineHeight: 24,
              }}
            />
          </View>

          {/* Add Photo Section */}
          {selectedImageUri ? (
            <View className="gap-2">
              <Image
                source={{ uri: selectedImageUri }}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 12,
                }}
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={handleRemoveImage}
                className="flex-row gap-2 justify-center items-center p-3 bg-red-50 rounded-xl border border-red-200"
              >
                <AntDesign name="delete" size={18} color="#DC2626" />
                <ThemedText className="text-sm" style={{ color: '#DC2626' }}>
                  Remove image
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
            // <TouchableOpacity
            //   className="flex-row gap-2 justify-center items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-300 border-dashed"
            //   onPress={handlePickImage}
            //   disabled={loading}
            // >
            //   <AntDesign name="picture" size={20} color="#0F9E99" />
            //   <ThemedText className="text-sm text-text">Add photo or image</ThemedText>
            // </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Share Button with Gradient */}
      <View className="p-5 bg-white border-t border-gray-200">
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <LinearGradient
            colors={loading ? ['#999', '#777'] : ['#0F9E99', '#0A7A76']} // Gray when loading
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row gap-2 justify-center items-center p-4 rounded-full"
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <ThemedText className="text-base font-semibold text-white">
                  Sharing...
                </ThemedText>
              </>
            ) : (
              <>
                <AntDesign name="right" size={18} color="white" />
                <ThemedText className="text-base font-semibold text-white">
                  Share with Family
                </ThemedText>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
