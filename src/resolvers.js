const path = require("path");
const fs = require("fs");

createWriteStream = fs.createWriteStream;

// the 'uploads' directory is supossed to contains
// the 'answers' and 'consults' directory
// uploads are classified by consult/answer id subdirectories
const baseDir = path.join(__dirname + `/../uploads/`);

module.exports = {
	Query: {
		consult: async (_, { id }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				getConsultById({ consultId: id }),
		consults: async (_, { state }, { dataSources }) => {
			if (!state) state = 'ALL';
			return await dataSources.dbJoomlaAPI.
				getAllConsults({ state })
		},
		specialists: async (_, { speciality }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.findSpecialists({ speciality }),
		me: async (_, __, { dataSources }) =>
			await dataSources.dbJoomlaAPI.findUser(),
		userByUsername: async (_, { username }, { dataSources }) =>
			dataSources.dbJoomlaAPI.findUser({ username }),
		ills: async (_, __, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				getIlls(),
		ill: async (_, { id }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				getIllById({ illId: id }),
		files: (_, { type, id }) => {
			// TODO
			// const dir = path.join(`${baseDir}${type.toLowerCase()}s/${id}/`);

		}
	},

	Mutation: {
		login: async (_, { username, password }, { dataSources }) => {
			const user = await dataSources.dbJoomlaAPI.
				findUser({ username, password });
			return user ?
				Buffer.from(username).toString('base64') : null; // token
		},
		answer: async (_, { consultId, answer }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				createAnswer({ consultId, answer }),
		updateAnswer: async (_, { answer }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				updateAnswer({ answer }),
		upload: async (_, { files, type, id }) => {
			const archivos = await files;
			return await saveFiles({ files: archivos, type, id });
		},
		updateAttachments: async (_, { type, id, filenames }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				updateAttachments({ type, id, filenames }),
		updateUser: async (_, { user }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				updateUser({ user }),
		assignSpecialist: async (_, { specialistId, consultId }, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				assignSpecialist({ specialistId, consultId }),
	},

	Consult: {
		answer: async (consult, _, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				getAnswerByConsultId({ consultId: consult.id })
	},

	User: {
		// TODO: consults of rural doctors, not just specialists
		consults: async (user, { state }, { dataSources }) => {
			if (!state) state = 'ALL';
			return await dataSources.dbJoomlaAPI.
				getConsultsBySpecialist({ username: user.username, state })
		}
	},

	Ill: {
		subIlls: async (ill, _, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				getSubIllsByIllId({ illId: ill.id })
	},

	Answer: {
		consult: async (answer, _, { dataSources }) =>
			await dataSources.dbJoomlaAPI.
				getConsultByAnswerId({ answerId: answer.id })
	}
};

async function saveFiles({ files, type, id }) {
	const dir = path.join(`${baseDir}${type.toLowerCase()}s/${id}/`);
	// creating dir if not exists.
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	let returnData = [];
	for (let i = 0; i < files.length; i++) {
		const { createReadStream, filename, mimetype, encoding } = await files[i];
		await new Promise(resolution => {
			try {
				createReadStream().pipe(
					createWriteStream(
						path.join(dir, filename)
					)
				).on("close", resolution);
				returnData.push({ filename, mimetype, encoding });
			} catch (error) {
				returnData.push(null);
			}
		});

	}
	return returnData;
}