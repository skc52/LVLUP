import { View, Text } from 'react-native'
import React , {useEffect} from 'react'
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Home from './screens/Home';
import Login from './screens/Login.jsx';
import Footer from './components/Footer';
import Profile from './screens/Profile';
import Register from './screens/Register.jsx';
import Camera from './screens/Camera.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/actions';
import {fetchConversationList} from './redux/messageActions'
import Loader from './components/Loader';
import EmailReset from './screens/EmailReset';
import ResetPw from './screens/ResetPw';
import ChangePw from './screens/ChangePW';
import ActivateAccount from './screens/ActivateAccount';
import Settings from './screens/Settings';
import SendActivate from './screens/SendActivate';
import SearchUser from './screens/SearchUser';
import SearchResults from './screens/SearchResults';
import FollowRequests from './screens/FollowRequests';
import UpdateProfile from './screens/UpdateProfile';
import ConversationListScreen from './screens/ConversationList';
import Conversation from './screens/Conversation';
import CreateChallengeScreen from './screens/CreateChallengeScreen';
import ChallengeListScreen from './screens/challengeListScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import DailyCheckIn from './screens/DailyCheckInScreen';
import ChallengesScreen from './screens/FetchChallenges'
import NewMessage from './screens/NewMessage';
import App from './screens/Posts';
import SharePost from './screens/SharePost';
const Stack = createNativeStackNavigator();


const Main = () => {

  const dispatch = useDispatch();
  const {isAuthenticated, loading, user} = useSelector(state=>state.auth)

  useEffect(()=>{
    console.log(isAuthenticated, "hh", loading)
    dispatch(loadUser())
    dispatch(fetchConversationList())
  }, [dispatch])

  return (
  //  loading? <Loader/> : 
   <NavigationContainer>
   {/* Like react routes    */}
   <Stack.Navigator initialRouteName={isAuthenticated?'posts':'login'}>
       {/* name is path */}

       <Stack.Screen name = 'home' component={Home}  options={{headerShown:false}}/>
       <Stack.Screen name = 'login' component={Login} options={{headerShown:false}}/>
       {isAuthenticated && 
       <Stack.Screen name = 'profile' component={Profile}options={{headerShown:false}}/>
        }
        {/* {isAuthenticated &&  */}
       <Stack.Screen name = 'settings' component={Settings}options={{headerShown:false}}/>
        {/* } */}
       <Stack.Screen name = 'register' component={Register}options={{headerShown:false}}/>
       <Stack.Screen name = 'searchUser' component={SearchUser}options={{headerShown:false}}/>
       <Stack.Screen name = 'conversation' component={Conversation}options={{headerShown:false}}/>

       <Stack.Screen name = 'conversationList' component={ConversationListScreen}options={{headerShown:false}}/>

       <Stack.Screen name = 'sendActivate' component={SendActivate}options={{headerShown:false}}/>
       <Stack.Screen name = 'searchResults' component={SearchResults}options={{headerShown:false}}/>
       <Stack.Screen name = 'followRequests' component={FollowRequests}options={{headerShown:false}}/>
       <Stack.Screen name = 'challengeCreate' component={CreateChallengeScreen}options={{headerShown:false}}/>
       <Stack.Screen name = 'challengeList' component={ChallengeListScreen}options={{headerShown:false}}/>
       <Stack.Screen name = 'challenge' component={ChallengeScreen}options={{headerShown:false}}/>
       <Stack.Screen name = 'checkin' component={DailyCheckIn}options={{headerShown:false}}/>
       <Stack.Screen name = 'challegesMine' component={ChallengesScreen}options={{headerShown:false}}/>
       <Stack.Screen name = 'newMessage' component={NewMessage}options={{headerShown:false}}/>
       <Stack.Screen name = 'posts' component={App}options={{headerShown:false}}/>
       <Stack.Screen name = 'postCreate' component={SharePost}options={{headerShown:false}}/>

       <Stack.Screen name = 'camera' component={Camera}options={{headerShown:false}}/>
       <Stack.Screen name = 'updateProfile' component={UpdateProfile}options={{headerShown:false}}/>

      {isAuthenticated && 
      <Stack.Screen name = 'changePw' component={ChangePw}options={{headerShown:false}}/>
      }
      {isAuthenticated && 
      <Stack.Screen name = 'activateAcc' component={ActivateAccount}options={{headerShown:false}}/>
      }
       <Stack.Screen name = 'emailReset' component={EmailReset}options={{headerShown:false}}/>
       <Stack.Screen name = 'resetPw' component={ResetPw}options={{headerShown:false}}/>
       

   </Stack.Navigator>

    {isAuthenticated && 
        <Footer/>
    }

</NavigationContainer>
  )
}

export default Main