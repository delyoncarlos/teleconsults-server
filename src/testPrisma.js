// We use findMany in situations where findOne will
// be more suitable, due to the poor database structure.
// Sadly, too many advantages that offer Prism, can not be
// used because there are not properly set PK properly in
// the original DB.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dbAPI = require('./datasources/dbjoomla');

async function main() {

	// const db = new dbAPI({prisma});

	// const specialist = await db.findUser({
	// 									username:'aromeroa',
	// 									password:'$2y$10$49kA9SBb4WM39qJMXDg7reLUTAZkcXN/zxTYwYEYLTWRVpc6RpM0C'});
	// const context = {
	// 	user:specialist
	// };
	// db.initialize({context});

	//const consults = await db.getConsultById({consultId:36});


	// const consults = await db.getConsultsBySpecialist('ANSWERED');
	// console.log(consults.map(c => c.aid));
	//	const answers = consults.map(c => (await db.getAnswerByConsultId({id: c.aid})));
	// const answers = await db.getAnswerByConsultId({consultId: consults[1].aid});

	const result = await prisma.answers.create({
		data: {
			CANTON:'test',
			PROVINCIA:'test',
			COMENTARIOS_CC:'test',
			ENFERCOD3C:'test',
			ENFERCOD4C:'test',
			ESPECIALIDAD:'test',
			FECHA:'test',
			HOSPITAL:'test',
			NOM_ESPECIALISTA:'test',
			PD_PROPUESTAS:'test',
			PLAN_EDUCA_PROPUESTO:'test',
			PLAN_TERAPIA_PROPUESTO:'test',
			PRE_TEXT:'test',
			DEF_TEXT:'test',
		}
	});

	console.log(result);
}

main()
	.catch(e => {
		throw e
	})
	.finally(async () => {
		await prisma.disconnect()
	})


