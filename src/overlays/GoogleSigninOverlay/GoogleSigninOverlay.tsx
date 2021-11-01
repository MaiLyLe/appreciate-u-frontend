import React from 'react'
import { useDispatch } from 'react-redux'
import * as Google from 'expo-google-app-auth'
// @ts-ignore
import { GOOGLE_CLIENT_ID } from '@env'
import { GoogleContact } from '../../globalTypes'
import { postGoogleContacts } from './actions'
import * as S from './styles'

type GoogleSigninOverlayProps = {
  /** Boolean value to set overlay visible or not*/
  isVisible: boolean
  /** Function to make overlay visible or not*/
  toggleOverlay: () => void
}

/**
 * Overlay that asks user if they want to sync Gmail contacts
 */

const GoogleSigninOverlay: React.FC<GoogleSigninOverlayProps> = ({
  isVisible,
  toggleOverlay,
}) => {
  const [accessTokenGoogle, setAccessTokenGoogle] = React.useState<
    string | null
  >(null)
  const [googleContacts, setGoogleContacts] = React.useState<
    null | GoogleContact[]
  >(null)

  const dispatch = useDispatch()

  const defaultheader = () => {
    //returns request header for Google People API
    return {
      method: null,
      body: null,
      crossDomain: true,
      cache: false,
      async: false,
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: '',
        Accept: '*/*',
        'Access-Control-Allow-Headers': '*',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  }

  const transformRequest = (obj: any) => {
    //creates main part for url string for Google
    var str = []
    for (var p in obj)
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    return str.join('&')
  }
  const getContacts = () => {
    //main function to fetch contacts from Google and puts contacts in a format that can be used by
    //backend as a state
    const header: any = defaultheader()
    let params = {
      alt: 'json',
      'max-results': 100,
    }
    header.method = 'GET'
    let url = 'https://www.google.com/m8/feeds/contacts/default/full?'
    var suburl = transformRequest(params)
    url = url + suburl
    header.headers['Authorization'] = 'Bearer ' + accessTokenGoogle
    fetch(url, header)
      .then((response) => {
        setTimeout(() => {
          let a = 0
        }, 0)
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson?.feed?.entry) {
          setGoogleContacts(
            responseJson?.feed?.entry?.map((entry: any) => {
              return {
                contact_owner: responseJson?.feed?.author?.[0]?.email?.$t,
                owned_contact: entry?.gd$email?.[0].address,
              }
            }),
          )
        } else {
          if (responseJson?.feed?.author?.[0]?.email?.$t) {
            setGoogleContacts([
              {
                contact_owner: responseJson?.feed?.author?.[0]?.email?.$t,
                owned_contact: '',
              },
            ])
          }
        }
      })
      .catch((error) => {
        console.log('An error occurred.Please try again', error)
      })
  }

  const signInAsync = async () => {
    //gets Google token
    try {
      const result = await Google.logInAsync({
        iosClientId: GOOGLE_CLIENT_ID,
        scopes: [
          'https://www.google.com/m8/feeds/',
          'https://www.googleapis.com/auth/contacts.readonly',
        ],
      })

      if (result.type === 'success') {
        if (result.accessToken) {
          setAccessTokenGoogle(result.accessToken)
        }
      }
    } catch (error) {
      console.log('Error Google Signup', error)
    }
  }
  React.useEffect(() => {
    //checks if google token available and then performs fetching contacts
    if (accessTokenGoogle) {
      getContacts()
    }
  }, [accessTokenGoogle])

  React.useEffect(() => {
    //starts Redux/Saga request for backend to sync fetched Google contacts with
    //logged-in user's contacts
    if (googleContacts?.length) {
      dispatch(postGoogleContacts(googleContacts))
      toggleOverlay()
    }
  }, [googleContacts])

  return (
    <S.Wrapper>
      {/**@ts-ignore*/}
      <S.OverlayContainer isVisible={isVisible} onBackdropPress={toggleOverlay}>
        <S.OverlayInfoText>{`Would you like to import your Google Contacts into your user recommendations?`}</S.OverlayInfoText>
        <S.ButtonRow>
          <S.NoButton
            title="No"
            onPress={toggleOverlay}
            color="#ACBAC3"
          ></S.NoButton>
          <S.SignInButton
            title="Login with Google"
            onPress={signInAsync}
            color="#91CFA2"
          ></S.SignInButton>
        </S.ButtonRow>
      </S.OverlayContainer>
    </S.Wrapper>
  )
}

export default GoogleSigninOverlay
