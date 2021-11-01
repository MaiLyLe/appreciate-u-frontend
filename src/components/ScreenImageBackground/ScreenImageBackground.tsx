import React, { ReactNode } from 'react'
import { Asset } from 'expo-asset'
import * as S from './styles'

type ScreenImageBackground = {
  /** Children inside this component */
  children: ReactNode
  /** Switch for making children centered or not vertically */
  isContentVerticallyCentered?: boolean
  /** Amount of padding on each side */
  paddingSides?: number
  /**Bool value for telling component to show the image version with no white cutout in the middle */
  isWithoutWhiteCutout?: boolean
}

/**
 * Renders image background for screens with SafeAreaView which means that it detects Keyboards
 * and other phone components and renders stuff without them disturbing your app
 */

const ScreenImageBackground: React.FC<ScreenImageBackground> = ({
  children,
  isContentVerticallyCentered,
  paddingSides,
  isWithoutWhiteCutout,
}) => {
  return (
    <S.SafeAreaView>
      {isWithoutWhiteCutout ? (
        <S.ImageBackground
          source={{
            uri: Asset.fromModule(require('../../files/pastel-bg2.png')).uri,
          }}
          paddingSides={paddingSides}
          isContentVerticallyCentered={isContentVerticallyCentered}
        >
          {children}
        </S.ImageBackground>
      ) : (
        <S.ImageBackground
          source={{
            uri: Asset.fromModule(require('../../files/pastel-bg.jpg')).uri,
          }}
          paddingSides={paddingSides}
          isContentVerticallyCentered={isContentVerticallyCentered}
        >
          {children}
        </S.ImageBackground>
      )}
    </S.SafeAreaView>
  )
}

export default ScreenImageBackground
