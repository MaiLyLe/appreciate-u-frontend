# About

This this the React Native frontend of the **AppreciateU app**, a bachelor thesis project that is supposed to showcase a mobile application that enables a logged-in user to send praise anonymously within a university context.

# Special Features

- Users have certain roles, in this case either "Student" or "Professor".
- They are shown a list of recommended users that they can send a message. The recommendation list starts with users that they are likely to know and ends with users they are least likely to know based on specific relationships, e.g. being in the logged-in user's google contacts or being in the same courses that the logged-in user.
- Using a sentiment analysis API messages where negative language is detected are not sent.
- Messages sent to the user are polled so the user is up-to-date with new messages sent to them.

# Stack

- React Native with Expo
- React Navigation
- Styled Components
- Typescript
- Redux
- Saga

# How to run the frontend locally in XCode Simulator

Since this app will not go into production, you will only find instructions on how to run this app on your local machine in the following. Since it is also developed and manually tested on XCode iOS simulator, it is best to make it running there. You will however need to get the backend running first. Instructions can be found here:

## Instructions for frontend

Disclaimer: For google credentials author has to provide you with .env file.

1. Install Node.js https://nodejs.org/en/
2. Open terminal and run `npm install -g expo-cli`
3. Open up the Mac App Store, search for Xcode, and hit install.
4. Now open XCode and then go to "Preferences" which is at the top bar. Go to "Components" and install the iPhone simulators this app should run on.
5. Clone or fork this repo.
6. Go to root directory of repo via terminal.
7. Now type `npm run ios`.
