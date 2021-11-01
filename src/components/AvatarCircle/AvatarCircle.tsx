import React from 'react'
import { Asset } from 'expo-asset'
import * as S from './styles'

type AvatarCircleProps = {
  /** Radius of image cirlce */
  radius: number
  /** Number of dummy image, right now number is even a fixed model property in database*/
  avatar_num?: number
  /** Width of coloured border of circle*/
  borderWidth?: number
  /** Uri for when user has own user_image */
  uri?: string
}

/**
 * Renders image circle for user with dummy images
 */

const AvatarCircle: React.FC<AvatarCircleProps> = ({
  radius,
  avatar_num,
  borderWidth,
  uri,
}) => {
  const renderAvatarImage = (imageIndex?: number) => {
    //function with switch for rendering specific dummy image
    //has to be switch because otherwise not rendered correctly by React
    switch (imageIndex) {
      case 1:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar1.png')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )

      case 2:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar2.png')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )

      case 3:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar3.png')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )
      case 4:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar4.png')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )

      case 5:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar5.png')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )
      case 6:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar6.png')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )
      case 7:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar7.jpeg')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )
      case 8:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar8.png')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )
      case 9:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar9.jpg')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )
      case 10:
        return (
          <S.AvatarImage
            source={{
              uri: Asset.fromModule(require('../../files/avatar10.jpeg')).uri,
            }}
            radius={radius}
            borderWidth={borderWidth}
          ></S.AvatarImage>
        )
      default:
    }
  }
  return (
    <>
      {!uri ? (
        renderAvatarImage(avatar_num)
      ) : (
        <S.AvatarImage
          source={{ uri: uri }}
          radius={radius}
          borderWidth={borderWidth}
        ></S.AvatarImage>
      )}
    </>
  )
}

export default AvatarCircle
