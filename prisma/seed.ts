import "dotenv/config"
import { PrismaClient } from "../prisma/generated/client/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.visitor.deleteMany()
  await prisma.event.deleteMany()
  await prisma.member.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.church.deleteMany()

  const church = await prisma.church.create({
    data: {
      name: "Igreja Batista Testemunho",
      slug: "igreja-batista-testemunho",
    },
  })

  const password = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.create({
    data: {
      churchId: church.id,
      name: "Admin ChurchHub",
      email: "admin@churchhub.com",
      password,
      role: "ADMIN",
    },
  })

  const membersData = [
    { name: "Ana Oliveira", email: "ana@email.com", phone: "(11) 99999-0001", birthDate: new Date("1990-03-15"), gender: "feminino", maritalStatus: "casado", baptized: true, ministry: "Louvor", address: "Rua das Flores, 123", city: "São Paulo", state: "SP" },
    { name: "Carlos Santos", email: "carlos@email.com", phone: "(11) 99999-0002", birthDate: new Date("1985-07-22"), gender: "masculino", maritalStatus: "casado", baptized: true, ministry: "Ensino", address: "Av. Paulista, 500", city: "São Paulo", state: "SP" },
    { name: "Maria Souza", email: "maria@email.com", phone: "(11) 99999-0003", birthDate: new Date("1995-01-10"), gender: "feminino", maritalStatus: "solteiro", baptized: true, ministry: "Infância", address: "Rua Augusta, 300", city: "São Paulo", state: "SP" },
    { name: "Pedro Lima", email: "pedro@email.com", phone: "(11) 99999-0004", birthDate: new Date("2000-11-30"), gender: "masculino", maritalStatus: "solteiro", baptized: false, ministry: "Juventude", address: "Rua da Paz, 50", city: "Osasco", state: "SP" },
    { name: "Luciana Costa", email: "luciana@email.com", phone: "(11) 99999-0005", birthDate: new Date("1988-05-18"), gender: "feminino", maritalStatus: "divorciado", baptized: true, ministry: "Ação Social", address: "Rua das Acácias, 200", city: "São Bernardo", state: "SP" },
    { name: "Rafael Almeida", email: "rafael@email.com", phone: "(11) 99999-0006", birthDate: new Date("1992-09-05"), gender: "masculino", maritalStatus: "casado", baptized: true, ministry: "Louvor", address: "Rua Nova, 150", city: "São Paulo", state: "SP" },
    { name: "Juliana Martins", email: "juliana@email.com", phone: "(11) 99999-0007", birthDate: new Date("1998-12-20"), gender: "feminino", maritalStatus: "solteiro", baptized: true, ministry: "Dança", address: "Av. Brasil, 1000", city: "Guarulhos", state: "SP" },
    { name: "Fernando Dias", email: "fernando@email.com", phone: "(11) 99999-0008", birthDate: new Date("1982-04-12"), gender: "masculino", maritalStatus: "casado", baptized: true, ministry: "Diaconia", address: "Rua da Igreja, 80", city: "São Paulo", state: "SP" },
  ]

  for (const member of membersData) {
    await prisma.member.create({
      data: {
        churchId: church.id,
        ...member,
      },
    })
  }

  const eventsData = [
    { title: "Culto de Domingo", description: "Culto tradicional de domingo", date: new Date("2026-08-02T09:00:00"), location: "Templo Principal" },
    { title: "Reunião de Oração", description: "Oração e intercessão", date: new Date("2026-07-29T19:00:00"), location: "Sala de Oração" },
    { title: "Estudo Bíblico", description: "Estudo do livro de Romanos", date: new Date("2026-07-30T20:00:00"), location: "Auditório" },
    { title: "Culto Jovem", description: "Culto específico para jovens", date: new Date("2026-08-01T19:30:00"), location: "Templo Principal" },
    { title: "Escola Bíblica", description: "Escola Bíblica Dominical", date: new Date("2026-08-02T08:00:00"), location: "Salas de Aula" },
  ]

  for (const event of eventsData) {
    await prisma.event.create({
      data: {
        churchId: church.id,
        ...event,
      },
    })
  }

  const visitorsData = [
    { name: "Roberto Carlos", phone: "(11) 98888-0001", invitedBy: "Ana Oliveira" },
    { name: "Patrícia Nunes", phone: "(11) 98888-0002", invitedBy: "Carlos Santos" },
    { name: "Gabriel Torres", phone: "(11) 98888-0003", invitedBy: "Maria Souza" },
  ]

  for (const visitor of visitorsData) {
    await prisma.visitor.create({
      data: {
        churchId: church.id,
        ...visitor,
      },
    })
  }

  console.log("")
  console.log("✅ Seed completed successfully!")
  console.log("")
  console.log(`  Church: ${church.name}`)
  console.log(`  Admin: admin@churchhub.com / admin123`)
  console.log(`  Members: ${membersData.length}`)
  console.log(`  Events: ${eventsData.length}`)
  console.log(`  Visitors: ${visitorsData.length}`)
  console.log("")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
