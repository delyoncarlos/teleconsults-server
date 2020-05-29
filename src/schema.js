const { gql } = require('apollo-server');

const typeDefs = gql`
	type Query {
		userByUsername(username: String!): User
		consult(id: ID!): Consult
		consults(state: consultState): [Consult]!
		specialists(speciality: String): [User]!
		me: User
		ills: [Ill]!
		ill(id: ID!): Ill
    	files(type:uploadType!, id:ID!): [File]
	}

	type Mutation {
		"""
		ask(consult: Consult!): consultUpdateResponse!
		"""
		assignSpecialist(specialistId: ID!, consultId: ID!): consultUpdateResponse!
		login(username: String!, password: String!): String # login token
		answer(consultId: ID!, answer: AnswerInput!): answerUpdateResponse!
		updateAnswer(answer: AnswerInput!): answerUpdateResponse!
		upload(files: [Upload]!, type:uploadType!, id:ID!): [File]! # type 'CONSULT' or 'ANSWER'
		updateAttachments(type: uploadType!, id:ID!, filenames: [String]!): [String]! #return the same filenames
		updateUser(user: UserInput!): userUpdateResponse!
	}

	enum uploadType {
		CONSULT
		ANSWER
	}


	type File {
		filename: String
		mimetype: String
		encoding: String
	}

	input UserInput {
		username: String!
		email: String
		phone: String
		password: String
	}

	input AnswerInput {
		id: ID # when updating
  		city: String
  		province: String
  		commentary: String
  		illId: String
  		subillId: String
  		speciality: String
  		hospital: String
		specialistName: String!
  		proposalDiagnosticTests: String
  		proposalEducation: String
  		proposalTherapy: String
  		diagnosisPresumtive: String
  		diagnosisDefinitive: String
	}

	type User {
		id: ID
		roles: [UserRole]!
		email: String
		name: String!
		username: String
		speciality: String
		speciality2: String
		hospital: String
		province: String
		city: String
		phone: String
		consults(state: consultState): [Consult]
	}

	enum UserRole{
		SPECIALIST
		RURAL
		COORDINATOR
	}

	type Consult {
  		id: ID!
  		date: String!
  		city: String
  		province: String
  		hospitalSpeciality: String
  		specialistName: String
  		dateAnswered: String
  		reason: String
  		operatingUnit: String
  		askerName: String!
		answer: Answer
		pacientDescription: String
		pacientName: String
		pacientAge: String
		pacientSex: String
		pacientCurrentIll: String
		pacientPatologics: String
		pacientWeight: String
		pacientSize: String
		pacientTemperature: String
		pacientHead: String
		pacientNeck: String
		pacientHeart: String
		pacientLungs: String
		pacientPerine: String
		pacientSkin: String
		pacientSurgical: String
		pacientLimb: String
		pacientIll: String
		pacientSubIll: String
		pacientAbdomen: String
		pacientAllergies: String
		pacientQuestions: String
		pacientComentaries: String
		pacientExams: String
	}

	type Ill {
		id: ID!
		name: String!
		subIlls: [Ill]
	}

	enum consultState {
		UNASSIGNED # not assigned any specialist yet
		PENDENT # assigned but but not answered
		ANSWERED
		ALL
	}

	type Answer {
  		id: String!
  		city: String
  		province: String
  		commentary: String
  		illId: String
  		subillId: String
  		speciality: String
  		date: String!
  		hospital: String
		specialistName: String!
  		proposalDiagnosticTests: String
  		proposalEducation: String
  		proposalTherapy: String
  		diagnosisPresumtive: String
  		diagnosisDefinitive: String
		attachments: String
		consult: Consult!
	}

	type consultUpdateResponse{
		success: Boolean!
		message: String
		consults: [Consult]
	}
	type answerUpdateResponse{
		success: Boolean!
		message: String
		answer: Answer!
		consult: Consult!
	}
	type userUpdateResponse{
		success: Boolean!
		message: String
		user: User
	}
`;

module.exports = typeDefs;