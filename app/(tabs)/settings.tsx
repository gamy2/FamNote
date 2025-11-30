import { ThemedText } from '@/components/themed-text'
import { Collapsible } from '@/components/ui/collapsible'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const settings = () => {
  return (
    <SafeAreaView className='flex-1 p-5 bg-backgroundV2'>
        <ThemedText>settings</ThemedText>
        <Collapsible title="Android, iOS, and web support">
                <ThemedText>
                  You can open this project on Android, iOS, and the web. To open the web version, press{' '}
                  <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
                </ThemedText>
              </Collapsible>
    </SafeAreaView>
  )
}

export default settings