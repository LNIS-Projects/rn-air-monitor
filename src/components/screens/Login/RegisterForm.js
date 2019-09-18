import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputField from '../../components/InputField';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import {w, h, totalSize} from '../../../api/Dimensions';
const passwordLogo = require('../../../../assets/password.png');
const eyeImg = require('../../../../assets/eye_black.png');
const personLogo = require('../../../../assets/person.png');
const emailLogo = require('../../../../assets/email.png');

export default class RegisterForm extends Component {
  constructor() {
    super();
    this.state = {
      focusPassword: false,
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      showPass: true,
      press: false,
      loading: true,
    };
    this.passwordInput = React.createRef();
    this.usernameInput = React.createRef();
    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();
  }

  userNameInputHandler = text => {
    this.setState({username: text});
    console.log('username ' + this.state.username);
  };
  passwordInputHandler = text => {
    this.setState({password: text});
  };
  firstNameInputHandler = text => {
    this.setState({firstName: text});
  };
  lastNameInputHandler = text => {
    this.setState({lastName: text});
  };

  showPass = () => {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  };

  focusPasswordAction = text => {
    this.setState({
      lastName: text,
    });
    console.log('user email ', this.state.username);
    this.passwordInput.focus();
  };

  focusFirstName = text => {
    this.setState({
      userName: text,
    });
    this.firstNameInput.focus();
  };

  focusLastName = text => {
    this.setState({
      firstName: text,
    });
    this.lastNameInput.focus();
  };

  passwordOnSubmitEditing = text => {
    this.onPress();
  };

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        loading: false,
        user,
      });
    });
  }

  /*
    @Todo:
    - add async when creating user
    - Check first and last name should not be empty
    - Show progress: Loading gif while waiting authentication
    - Navigate back to login tab for login
    - Put user info into fire store
  */
  onPress = () => {
    const {username, password, firstName, lastName} = this.state;
    console.log(username + '/' + password + '/' + firstName + '/' + lastName);
    if (username.length === 0 || password.length === 0) {
      Alert.alert(
        // in this case user has not enter anything to InputField
        'Create fail!',
        'Username/password should not be empty.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.usernameInput.focus();
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
    if (firstName.length === 0 || lastName.length === 0) {
      Alert.alert(
        // in this case user has not enter anything to InputField
        'Create fail!',
        'firstName/lastName should not be empty.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.firstNameInput.focus();
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(username, password)
      .then(userCredential => {
        // Success
        console.log('Created successful with ' + userCredential.user.email);
        // DO some other things
        Alert.alert(
          // Notice user about successfully created
          'User created!',
          'User email ' + username,
          [
            {
              text: 'OK',
              onPress: () => {
                this.props.onActionDone();
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch(error => {
        const {code, message} = error;
        let alertMessage = message;
        switch (code) {
          case 'auth/invalid-email':
            alertMessage = message + ' Email should be yourmail@example.com';
            console.log(code + ' Invalid email address format.');
            break;
          case 'auth/email-already-in-use':
            alertMessage = message + username;
            console.log('email-already-in-use');
            break;
          case 'auth/weak-password':
            alertMessage = message + password;
            console.log('weak-password');
            break;
          default:
            alertMessage = 'Check your internet connection!';
            console.log(code + ' Check your internet connection');
        }
        Alert.alert(
          'Create failed',
          alertMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                this.usernameInput.focus();
              },
            },
          ],
          {cancelable: false},
        );
      });
  };
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <InputField
          source={emailLogo}
          placeholder={'Email address'}
          secureTextEntry={false}
          autoCorrect={false}
          returnKeyType={'next'}
          maxLength={25}
          onSubmitEditingFunc={({nativeEvent}) =>
            this.focusFirstName(nativeEvent.text)
          }
          onChangeTextFunc={this.userNameInputHandler}
          ref={input => {
            this.usernameInput = input;
          }}
        />
        <InputField
          source={personLogo}
          placeholder={'First name'}
          secureTextEntry={false}
          autoCorrect={false}
          returnKeyType={'next'}
          maxLength={25}
          onSubmitEditingFunc={({nativeEvent}) =>
            this.focusLastName(nativeEvent.text)
          }
          onChangeTextFunc={this.firstNameInputHandler}
          ref={input => {
            this.firstNameInput = input;
          }}
        />
        <InputField
          source={personLogo}
          placeholder={'Last name'}
          secureTextEntry={false}
          autoCorrect={false}
          returnKeyType={'next'}
          maxLength={25}
          onSubmitEditingFunc={({nativeEvent}) =>
            this.focusPasswordAction(nativeEvent.text)
          }
          onChangeTextFunc={this.lastNameInputHandler}
          ref={input => {
            this.lastNameInput = input;
          }}
        />
        <InputField
          source={passwordLogo}
          placeholder={'Create a Password'}
          secureTextEntry={this.state.showPass}
          returnKeyType={'done'}
          maxLength={25}
          onSubmitEditingFunc={({nativeEvent}) =>
            this.passwordOnSubmitEditing(nativeEvent.text)
          }
          onChangeTextFunc={this.passwordInputHandler}
          ref={input => {
            this.passwordInput = input;
          }}
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={this.onPress}>
          <Text style={styles.buttonText}> Register User </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}>
          <Image source={eyeImg} style={styles.iconEye} resizeMode="contain" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

RegisterForm.propTypes = {
  onActionDone: PropTypes.func,
};
const styles = StyleSheet.create({
  container: {
    height: h(37),
    width: w(85),
    // marginBottom: h(10),
    // alignContent: 'center',
    // alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#446e46',
    borderRadius: totalSize(2),
  },
  buttonContainer: {
    height: h(5),
    width: w(75),
    alignSelf: 'center',
    marginTop: h(2),
    marginBottom: h(2),
    borderRadius: w(7),
    backgroundColor: 'rgba(123,184,126,0.5)',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: totalSize(2.5),
    color: 'white',
    paddingTop: h(0.5),
  },
  iconEye: {
    width: w(6),
    height: h(6),
    tintColor: 'rgba(0,0,0,0.2)',
  },
  btnEye: {
    position: 'absolute',
    bottom: h(9.5),
    right: w(7),
  },
});
