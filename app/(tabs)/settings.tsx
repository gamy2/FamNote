import { ThemedText } from '@/components/themed-text'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const settings = () => {
  return (
    <SafeAreaView className='p-5'>
        <ThemedText>settings</ThemedText>
    </SafeAreaView>
  )
}

export default settings