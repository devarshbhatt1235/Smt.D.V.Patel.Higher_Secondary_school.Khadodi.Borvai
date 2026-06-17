import bcrypt from "bcrypt";
import { Admin } from "../models/Admin";
import { Notice } from "../models/Notice";
import { SchoolInfo } from "../models/SchoolInfo";
import { Management } from "../models/Management";
import { Staff } from "../models/Staff";
import { Student } from "../models/Student";
import { TopStudent } from "../models/TopStudent";
import { logger } from "./logger";

export async function seedDatabase() {
  try {
    // Seed admin
    const adminExists = await Admin.findOne({ email: "dvpatelhighschool@gmail.com" });
    if (!adminExists) {
      const hash = await bcrypt.hash("dvpatel@123", 10);
      await Admin.create({ email: "dvpatelhighschool@gmail.com", passwordHash: hash, name: "Admin" });
      logger.info("Admin seeded");
    }

    // Seed school info
    const infoExists = await SchoolInfo.findOne();
    if (!infoExists) {
      await SchoolInfo.create({
        nameGujarati: "શ્રીમતી ડી વી પટેલ ઉ.મા.શાળા ખડોદી બોરવાઈ",
        nameEnglish: "Shrimati DV Patel Upper Secondary School Khadodi Borwai",
        trustName: "શ્રી ખડોદી બોરવાઈ ગ્રુપ કેળવણી મંડળ ખડોદી બોરવાઈ",
        address: "મુકામ પોસ્ટ બોરવાઈ, તાલુકો ખાનપુર, જિલ્લો મહીસાગર, પિન ૩૮૯૨૩૨, ગુજરાત",
        established: 1972,
        principalName: "શ્રી હરેશકુમાર ડાહ્યાભાઈ ભટ્ટ",
        presidentName: "શ્રી ત્રિવેદી રમણલાલ હીરાલાલ",
        secretaryName: "શ્રી જોશી પ્રવિણચંદ્ર પ્રેમશંકર",
        facilities: ["Modern Laboratory", "Computer Room", "Smart Board", "Kabaddi Ground", "Cricket Ground", "Basketball Ground", "Volleyball Ground"],
      });
      logger.info("School info seeded");
    }

    // Seed notices
    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      await Notice.insertMany([
        { title: "રજા સૂચના – ઉત્તરાયણ", content: "ઉત્તરાયણ (14-15 જાન્યુઆરી) ની ઉજવણી અર્થે શાળા બંધ રહેશે.", published: true },
        { title: "સ્વ-મૂલ્યાંકન કેમ્પ", content: "ધોરણ 11 અને 12 ના વિદ્યાર્થીઓ માટે 15 ફેબ્રુઆરી 2025 ના રોજ સ્વ-મૂલ્યાંકન વિશેષ શિબિર.", published: true },
        { title: "વાર્ષિક ઉત્સવ", content: "શાળાનો વાર્ષિક ઉત્સવ 5 માર્ચ 2025 ના રોજ સવારે 10:00 વાગ્યે યોજાશે.", published: true },
      ]);
      logger.info("Notices seeded");
    }

    // Seed management members
    const mgmtCount = await Management.countDocuments();
    if (mgmtCount === 0) {
      await Management.insertMany([
        { name: "શ્રી ત્રિવેદી રમણલાલ હીરાલાલ", designation: "પ્રમુખ", order: 1 },
        { name: "શ્રી જોશી પ્રવિણચંદ્ર પ્રેમશંકર", designation: "મંત્રી", order: 2 },
        { name: "શ્રી પટેલ ભૂપેન્દ્રભાઈ નટવરલાલ", designation: "ખજાનચી", order: 3 },
        { name: "શ્રી શાહ દિનેશભાઈ રમણલાલ", designation: "સભ્ય", order: 4 },
        { name: "શ્રીમતી ચૌધરી ઉષાબેન ભૂપેન્દ્રભાઈ", designation: "સભ્ય", order: 5 },
        { name: "શ્રી ઠક્કર કિરણભાઈ ગોવિંદભાઈ", designation: "સભ્ય", order: 6 },
      ]);
      logger.info("Management seeded");
    }

    // Seed staff
    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      await Staff.insertMany([
        { name: "શ્રી હરેશકુમાર ડાહ્યાભાઈ ભટ્ટ", designation: "આચાર્ય", qualification: "M.A., B.Ed.", subjectsTaught: ["ગુજરાતી", "સંસ્કૃત"], employeeNumber: "EMP001", joiningDate: "1995-06-01" },
        { name: "શ્રી રમેશભાઈ પટેલ", designation: "શિક્ષક", qualification: "M.Sc., B.Ed.", subjectsTaught: ["ગણિત", "વિજ્ઞાન"], employeeNumber: "EMP002", joiningDate: "1998-07-15" },
        { name: "શ્રીમતી ઉષાબેન શાહ", designation: "શિક્ષક", qualification: "M.A., B.Ed.", subjectsTaught: ["સામાજિક વિજ્ઞાન", "ઇતિહાસ"], employeeNumber: "EMP003", joiningDate: "2001-06-01" },
        { name: "શ્રી દિનેશભાઈ ચૌધરી", designation: "શિક્ષક", qualification: "M.Sc., B.Ed.", subjectsTaught: ["ભૌતિક વિજ્ઞાન", "રસાયણ"], employeeNumber: "EMP004", joiningDate: "2005-07-01" },
        { name: "શ્રીમતી ભાવનાબેન ત્રિવેદી", designation: "શિક્ષક", qualification: "M.A., B.Ed.", subjectsTaught: ["અંગ્રેજી"], employeeNumber: "EMP005", joiningDate: "2008-06-01" },
        { name: "શ્રી કિરણભાઈ ઠક્કર", designation: "શારીરિક શિક્ષક", qualification: "M.P.Ed.", subjectsTaught: ["શારીરિક શિક્ષણ"], employeeNumber: "EMP006", joiningDate: "2010-07-01" },
      ]);
      logger.info("Staff seeded");
    }

    // Seed students
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany([
        { name: "ઓમ પટેલ", grNumber: "GR001", class: "12", gender: "M" },
        { name: "પ્રિયા શાહ", grNumber: "GR002", class: "12", gender: "F" },
        { name: "રાહુલ ઠક્કર", grNumber: "GR003", class: "11", gender: "M" },
        { name: "નેહા ચૌધરી", grNumber: "GR004", class: "11", gender: "F" },
        { name: "વિરાટ ભટ્ટ", grNumber: "GR005", class: "10A", gender: "M" },
        { name: "ઐશ્વર્યા પટેલ", grNumber: "GR006", class: "10A", gender: "F" },
        { name: "ધ્રુવ શાહ", grNumber: "GR007", class: "10B", gender: "M" },
        { name: "ક્રિષ્ના ત્રિવેદી", grNumber: "GR008", class: "10B", gender: "F" },
        { name: "ઇશાન ઠક્કર", grNumber: "GR009", class: "9A", gender: "M" },
        { name: "સ્નેહા ચૌધરી", grNumber: "GR010", class: "9A", gender: "F" },
        { name: "ક્રિષ્ના ભટ્ટ", grNumber: "GR011", class: "9B", gender: "M" },
        { name: "ઈક્ષા પટેલ", grNumber: "GR012", class: "9B", gender: "F" },
      ]);
      logger.info("Students seeded");
    }

    // Seed top students
    const topCount = await TopStudent.countDocuments();
    if (topCount === 0) {
      await TopStudent.insertMany([
        { name: "પ્રિયા શાહ", fatherName: "સુરેશભાઈ શાહ", class: "12", rank: 1, percentage: 96.5, year: "2023-24" },
        { name: "ઓમ પટેલ", fatherName: "રમેશભાઈ પટેલ", class: "12", rank: 2, percentage: 94.2, year: "2023-24" },
        { name: "નેહા ચૌધરી", fatherName: "ભૂપેન્દ્રભાઈ ચૌધરી", class: "12", rank: 3, percentage: 92.8, year: "2023-24" },
        { name: "ઐશ્વર્યા પટેલ", fatherName: "ધ્રુવ પટેલ", class: "10A", rank: 1, percentage: 98.0, year: "2023-24" },
        { name: "વિરાટ ભટ્ટ", fatherName: "હિરેન ભટ્ટ", class: "10A", rank: 2, percentage: 95.5, year: "2023-24" },
      ]);
      logger.info("Top students seeded");
    }

  } catch (err) {
    logger.error({ err }, "Seed error");
  }
}
