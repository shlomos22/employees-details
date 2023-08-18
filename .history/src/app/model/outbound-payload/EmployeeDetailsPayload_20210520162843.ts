interface EmployeeDetailsPayload {
  AuthorizedNumber: string
  EmployeeActive: string
  FB_uid: string
  FirstName: string
  Lang: string
  LastName: string
  Operator_Desc: string
  PIN_Code: string
  TypeActive: string
  Type_Desc: string
  Type_id: string
  branchCode: string
  branchId: string
  branchName: string
  dtCreated: string
  dtUpdated: string
  idNumber: string
  mail: string
  operator_id: string
  personId: string
  phoneMain: string
  typeEnd: string
  typeStart: string
  workerCode: string
}

interface RecoveryCardEmployeePayload {
  employeeLanguage: string
  employeePinCode: string
  employeeRole1Code: string
  employeeRole1Date: string
  envIssuerId: string
  recoveryCardEmployeeId: string
}

export default EmployeeDetailsPayload



