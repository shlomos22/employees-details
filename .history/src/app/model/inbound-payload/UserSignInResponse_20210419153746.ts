interface UserSignInResponse {
  sessionData: SessionData
  userData: UserData
}

interface SessionData {
  uid: string,
  session: string
}

interface UserData {
  firstName: string
  idNumber: string
  lastName: string
  operatorId: string
  operatorName: string
}

export default UserSignInResponse
