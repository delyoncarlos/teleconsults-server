const { DataSource } = require('apollo-datasource');
const bcrypt = require('bcryptjs');
// const isEmail = require('isemail'); // remove?
const { sendEmail, sendNotification } = require('../utils');

// TODO: improve this
const userRoles = { 10: 'RURAL', 11: 'SPECIALIST', 13: 'COORDINATOR' };

class DbJoomlaAPI extends DataSource {
	constructor({ prisma }) {
		super();
		this.prisma = prisma;
	}

	/**
	 * This is a function that gets called by ApolloServer when being setup.
	 * This function gets called with the datasource config including things
	 * like caches and context. We'll assign this.context to the request context
	 * here, so we can know about the user making requests
	 */
	initialize(config) {
		this.context = config.context;
	}

	/**
	 * User can be called with an argument , but it doesn't
	 * have to be. If the user is already on the context, it will use that user
	 * instead
	 */
	async getUserRoles({ userId }) {
		const user = await this.prisma.users.findOne({ where: { id: userId } });
		if (!user) return null;

		// looking for their role
		const maps = await this.prisma.usergroupMap.findMany({
			where: {
				user_id: userId
			}
		});
		if (!maps) return null;

		return maps.map(m => userRoles[m.group_id]);
	}

	async findUser({ username: usernameArg, password } = {}) {
		const username = this.context && this.context.user
			? this.context.user.username
			: usernameArg;

		if (!username) return null;

		const user = await this.prisma.users.findOne({ where: { username } });
		if (!user) return null;

		// getting user roles
		const roles = await this.getUserRoles({ userId: user.id });
		user.roles = roles;

		// comparing password hashing
		if (password)
			if (!bcrypt.compareSync(password, user.password)) return null;
		delete user.password; // not needed by any user

		// adding specialist info if any
		if (roles.includes('SPECIALIST')) {
			let specialist = await this.prisma.specialists.
				findOne({ where: { nom_medesp: user.name } });
			if (!specialist) return user;
			specialist = this.specialistReducer(specialist);
			return {
				...user,
				...specialist,
			}
		}
		// not a specialist
		return user;
	}

	async findSpecialists({ speciality } = {}) {
		// could be any of their specialities
		const query = !speciality ? {} : {
			where: {
				OR: [{ especialidad: speciality }, { ESPECIALIDAD2: speciality }]
			}
		};

		let specialists = await this.prisma.specialists.
			findMany(query);
		return !specialists ? null : specialists.map(specialist => this.specialistReducer(specialist));
	}

	async findSpecialistById({ specialistId }) {
		const specialist = await this.prisma.specialists.findOne({ where: { id_medesp: Number(specialistId) } });
		return !specialist ? null : this.specialistReducer(specialist);
	}

	async getConsultsBySpecialist({ username: usernameArg, state }) {
		const userLogin = this.context.user;
		const username = usernameArg ?
			usernameArg
			: (userLogin && userLogin.username);
		if (!username) return null;
		const specialist = await this.findUser({ username });
		// not an specialist
		if (!specialist.speciality) return null;

		const consults = await this.prisma.consults.findMany({
			where: { ESP_SELECCION: specialist.name },
			orderBy: { FECHA: 'desc' }
		});
		switch (state) {
			case 'ALL':
				return consults.map(c => this.consultReducer(c));
				break;
			case 'ANSWERED':
				return consults.map(c => this.consultReducer(c)).
					filter(c => c.dateAnswered);
				break;
			case 'PENDENT':
				return consults.map(c => this.consultReducer(c)).
					filter(c => !c.dateAnswered);
				break;
			case 'UNASSIGNED':
				return consults.map(c => this.consultReducer(c)).
					filter(c => !c.specialistName);
				break;
			default:
				return null;
		}
	}

	async getConsultById({ consultId }) {
		const consult = await this.prisma.consults.findOne({ where: { aid: Number(consultId) } });
		return consult ? this.consultReducer(consult) : null;
	}

	async getAllConsults({ state }) {
		const consults = await this.prisma.consults.findMany();
		switch (state) {
			case 'ALL':
				return consults.map(c => this.consultReducer(c));
				break;
			case 'ANSWERED':
				return consults.map(c => this.consultReducer(c)).
					filter(c => c.dateAnswered);
				break;
			case 'PENDENT':
				return consults.map(c => this.consultReducer(c)).
					filter(c => !c.dateAnswered);
				break;
			case 'UNASSIGNED':
				return consults.map(c => this.consultReducer(c)).
					filter(c => !c.specialistName);
				break;
			default:
				return null;
		}
	}

	async getAnswerByConsultId({ consultId }) {
		const consult = await this.getConsultById({ consultId });
		// if has not be answered
		if (!consult.dateAnswered) return null;
		const answer = await this.prisma.answers.findMany({
			where: {
				FECHA: consult.dateAnswered,
				NOM_ESPECIALISTA: consult.specialistName
			}
		});

		return answer && answer[0] ? this.answerReducer(answer[0]) : null;
	}

	async getAnswerById({ answerId }) {
		const answer = await this.prisma.answers.findOne({ where: { aid: Number(answerId) } });
		return answer ? this.answerReducer(answer) : null;
	}

	async getConsultByAnswerId({ answerId }) {
		const answer = this.getAnswerById({ answerId });
		const consults = await this.prisma.consults.findMany({
			where: {
				date_contestado: answer.date,
				ESP_SELECCION: answer.specialistName
			}
		});

		return consults && consults[0] ? this.consultReducer(consults[0]) : null;
	}

	async getIlls() {
		const ills = await this.prisma.ills.findMany();
		return ills.map(i => this.illReducer(i));
	}

	async getIllById({ illId }) {
		const ill = await this.prisma.ills.
			findOne({ where: { COD_3: illId } });
		if (!ill) return null;
		return this.illReducer(ill);
	}

	async getSubIllsByIllId({ illId }) {
		const subIlls = await this.prisma.subIlls.findMany(
			{ where: { ENFER3C: illId } });
		return subIlls.map(s => this.subIllReducer(s));
	}

	async createAnswer({ consultId, answer }) {
		// create a common timestamp to
		// relate the answer and the consult
		const unixEpoch = String(Date.now());
		answer.date = unixEpoch;
		const answerDB = this.answerToDB(answer);
		const answerCreated = await this.prisma.answers.create({
			data: answerDB
		});
		// update the consult's answered date
		const consultUpdated = await this.prisma.consults.update({
			data: { date_contestado: unixEpoch },
			where: { aid: Number(consultId) }
		});
		const success = !!answerCreated && !!consultUpdated;
		return {
			success,
			message: success ? 'Answer created succesfuly' : 'Error creating the answer',
			answer: this.answerReducer(answerCreated),
			consult: this.consultReducer(consultUpdated)
		};
	}

	async updateAnswer({ answer }) {
		const id = answer.id;
		const answerDB = this.answerToDB(answer);
		const answerUpdated = await this.prisma.answers.update({
			data: answerDB,
			where: { aid: Number(id) }
		});
		const success = !!answerUpdated;
		return {
			success,
			message: success ? 'Answer updated succesfuly' : 'Error updating the answer',
			answer: this.answerReducer(answerUpdated),
			consult: null
		};
	}

	async updateAttachments({ type, id, filenames }) {
		let updated = null;
		const queryArg = {
			data: { ECG: filenames.toString() },
			where: { aid: Number(id) }
		};

		if (type === 'CONSULT') {
			updated = await this.prisma.consults.update(queryArg);
		} else {
			updated = await this.prisma.answers.update(queryArg);
		}

		return updated ? filenames : null;
	}

	async updateUser({ user }) {
		const loggedUser = this.context && this.context.user;
		if (!loggedUser) return null;
		// stop mutation if username is taken
		if ((user.username != loggedUser.username) && await this.userExist(user.username)) {
			return {
				success: false,
				message: 'Nombre de usuario ya existente',
				User: null
			};
		}

		const queryData = {};
		if (user.email) queryData.email = user.email;
		if (user.password) queryData.password = bcrypt.hashSync(user.password, 10); // saving password hash
		if (user.username) queryData.username = user.username;

		let userUpdated = {};
		// if queryData is not empty
		if (Object.keys(queryData).length > 0) {
			userUpdated = await this.prisma.users.update({
				data: queryData,
				where: { username: loggedUser.username }
			});
		}
		if (!userUpdated) return null;

		// if we have to update the phone
		let specialistUpdated = {};
		if (user.phone) {
			specialistUpdated = await this.prisma.specialists.update({
				data: {
					telefono: user.phone
				},
				where: { nom_medesp: loggedUser.name }
			});
			if (specialistUpdated) userUpdated.phone = specialistUpdated.phone;
		}

		const success = !!userUpdated && !!specialistUpdated;
		return {
			success,
			message: success ? 'Sus datos fueron actualizados' : 'Error actualizando sus datos.',
			user: userUpdated ? userUpdated : null
		};
	}

	async userExist(username) {
		const user = await this.prisma.users.findOne({ where: { username } });
		return !!user;
	}

	async assignSpecialist({ specialistId, consultId }) {
		let consult = await this.getConsultById({ consultId });
		if (!consult) return null;
		let specialist = await this.findSpecialistById({ specialistId });
		if (!specialist) return null;

		const consultUpdated = await this.prisma.consults.update({
			data: { ESP_SELECCION: specialist.name },
			where: { aid: Number(consultId) }
		});

		if (!!consultUpdated) {
			// TODO: add link to app in messages
			sendEmail({
				mailFrom: 'carolusdelyon@outlook.com',
				nameFrom: 'Teleconsultas Cayapas',
				mailTo: 'calbertodillon@gmail.com',
				nameTo: 'Especialista',
				subject: 'Teleconsulta Asignada',
				messageText: `Se le ha asignado la siguiente teleconsulta: ${consult.id}.`,
				messageHTML: `Se le ha asignado la siguiente teleconsulta: ${consult.id}. <a href="http://18.217.185.213:3000"> Ir ahora</a>.`
			}).then(result => console.log(result)).catch(error => console.log(error));
			sendNotification({ username: 'medico2', message: `Se le ha asignado la siguiente teleconsulta: ${consult.id}.` });
		}

		return {
			success: !!consultUpdated,
			message: consultUpdated ? 'Consulta asignada exitosamente' :
				'Error al asignar la consulta',
			consults: [consult]
		};
	}


	/*
	// reducers to adapt the db model to our graph schema
	*/
	specialistReducer(specialist) {
		return {
			id: specialist.id_medesp,
			name: specialist.nom_medesp,
			speciality: specialist.especialidad,
			speciality2: specialist.ESPECIALIDAD2,
			hospital: specialist.HOSPITAL,
			province: specialist.PROVINCIA,
			city: specialist.CANTON,
			phone: specialist.telefono
		}
	}

	consultReducer(consult) {
		return {
			id: consult.aid,
			date: consult.FECHA,
			city: consult.CANTON,
			province: consult.PROVINCIA,
			hospitalSpeciality: consult.ESPECIALIDAD_HOSPITAL,
			askerName: consult.MEDICO_ENVIA,
			specialistName: consult.ESP_SELECCION,
			dateAnswered: consult.date_contestado,
			reason: consult.MOTIVO_CONSULTA,
			operatingUnit: consult.UNIDAD_OPERATIVA,
			pacientDescription: consult.PAC_REG,
			pacientName: consult.NOMBRE_PACIENTE,
			pacientAge: consult.EDAD_ANOS,
			pacientSex: consult.SEXO,
			pacientCurrentIll: consult.ENFERMEDAD_ACTUAL,
			pacientPatologics: consult.PATOLOGICOS,
			pacientWeight: consult.PESO,
			pacientSize: consult.TALLA,
			pacientTemperature: consult.TEMPERATURA,
			pacientHead: consult.CABEZA,
			pacientNeck: consult.CUELLO,
			pacientHeart: consult.CORAZON,
			pacientLungs: consult.PULMONES,
			pacientPerine: consult.PERINE,
			pacientSkin: consult.PIEL,
			pacientSurgical: consult.QUIRURGICOS,
			pacientLimb: consult.EXTREMIDADES,
			pacientIll: consult.ENFERCOD3C,
			pacientSubIll: consult.ENFERCOD4C,
			pacientAbdomen: consult.ABDOMEN,
			pacientAllergies: consult.ALERGICOS,
			pacientQuestions: consult.COMENTARIOS_PREGUNTAS,
			pacientComentaries: consult.comentario_nota,
			pacientExams: consult.EXA_REALIZADOS,
		}
	}

	answerReducer(answer) {
		return {
			id: answer.aid,
			city: answer.CANTON,
			province: answer.PROVINCIA,
			commentary: answer.COMENTARIOS_CC,
			illId: answer.ENFERCOD3C,
			subillId: answer.ENFERCOD4C,
			speciality: answer.ESPECIALIDAD,
			date: answer.FECHA,
			hospital: answer.HOSPITAL,
			specialistName: answer.NOM_ESPECIALISTA,
			proposalDiagnosticTests: answer.PD_PROPUESTAS,
			proposalEducation: answer.PLAN_EDUCA_PROPUESTO,
			proposalTherapy: answer.PLAN_TERAPIA_PROPUESTO,
			diagnosisPresumtive: answer.PRE_TEXT,
			diagnosisDefinitive: answer.DEF_TEXT,
			attachments: answer.ECG
		}
	}

	// adapt our answer model to that
	// in the DB one
	answerToDB(answer) {
		return {
			CANTON: answer.city,
			PROVINCIA: answer.province,
			COMENTARIOS_CC: answer.commentary,
			ENFERCOD3C: answer.illId,
			ENFERCOD4C: answer.subillId,
			ESPECIALIDAD: answer.speciality,
			FECHA: answer.date,
			HOSPITAL: answer.hospital,
			NOM_ESPECIALISTA: answer.specialistName,
			PD_PROPUESTAS: answer.proposalDiagnosticTests,
			PLAN_EDUCA_PROPUESTO: answer.proposalEducation,
			PLAN_TERAPIA_PROPUESTO: answer.proposalTherapy,
			PRE_TEXT: answer.diagnosisPresumtive,
			DEF_TEXT: answer.diagnosisDefinitive,
			ECG: answer.attachments
		}
	}

	illReducer(ill) {
		return {
			id: ill.COD_3,
			name: ill.DESCRIPCION3C
		}
	}

	subIllReducer(subIll) {
		return {
			id: subIll.COD_4,
			name: subIll.DESCRIPCION4C,
			subIllId: subIll.ENFER3C
		}
	}
}

module.exports = DbJoomlaAPI;
