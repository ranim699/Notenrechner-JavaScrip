// ==========================================================
// Study plans of the Bachelor "Wirtschaftsinformatik" at FH Dortmund
// Source: Studiengangsprüfungsordnung (StgPO) Wirtschaftsinformatik,
//         reading version 09/2025, Anlage 1 (Studienverlaufsplan) and Anlage 2,
//         and the Modulhandbuch Bachelor Wirtschaftsinformatik (PO 2018).
//
// cp     = credit points (ECTS / Leistungspunkte)
// graded = false for modules that are only "passed / not passed"
//          (they do not count for the final grade, StgPO Anlage 1, note 1)
// choice = the student picks one module from a list
// ==========================================================

const ELECTIVE_CATALOG = [
  "Angewandte Logiken",
  "Angewandte Unternehmensführung",
  "Anwendungsentwicklung mit Low-Code-Entwicklungs-Plattformen",
  "Anwendung generativer KI in der Wirtschaftsinformatik",
  "Ausgewählte Aspekte der Wirtschaftsinformatik 1",
  "Ausgewählte Aspekte der Wirtschaftsinformatik 2",
  "Ausgewählte Aspekte der Wirtschaftsinformatik 3",
  "Beschaffungsmanagement",
  "Componentware",
  "Controlling",
  "Data Mining in Industrie und Wirtschaft",
  "Datenbanken 2",
  "Datenschutz und Datensicherheit",
  "Digital Design",
  "Digitale Logistik und Internet of Things",
  "Investition und Finanzierung",
  "IT-Servicemanagement",
  "Kommunikations- und Rechnernetze",
  "Kooperative Systeme",
  "Künstliche Intelligenz",
  "Marketing",
  "Mensch-Computer-Interaktion",
  "Mobile App Engineering",
  "Moderne Datenbanken",
  "Operations Research",
  "Produktionsmanagement",
  "Softwaretechnik C",
  "Softwaretechnik D",
  "Supply Chain Management und Logistik",
  "Elective from another programme / university"
];

const APPLIED_BWL_CHOICES = [
  "Angewandte Unternehmensführung",
  "Supply Chain Management und Logistik"
];

const STUDY_PLANS = {
  "wi6": {
    title: "Wirtschaftsinformatik B.Sc. (6 semesters, 180 CP)",
    totalCp: 180,
    modules: [
      { id: "prog1", name: "Einführung in die Programmierung", semester: 1, cp: 5, graded: true },
      { id: "itinf", name: "IT-Infrastruktur", semester: 1, cp: 2.5, graded: true },
      { id: "ewi1", name: "Einführung in die Wirtschaftsinformatik 1", semester: 1, cp: 5, graded: true },
      { id: "math1", name: "Mathematik für Wirtschaftsinformatik 1", semester: 1, cp: 5, graded: true },
      { id: "bwl", name: "Allgemeine BWL/Unternehmensführung", semester: 1, cp: 5, graded: true },
      { id: "hrm", name: "Human Resource Management und Organisation", semester: 1, cp: 5, graded: true },
      { id: "lat", name: "Lern- u. Arbeitstechniken / Studium Generale / Mentoring", semester: 1, cp: 2.5, graded: false },

      { id: "algo", name: "Algorithmen und Datenstrukturen", semester: 2, cp: 5, graded: true },
      { id: "ewi2", name: "Einführung in die Wirtschaftsinformatik 2", semester: 2, cp: 5, graded: true },
      { id: "db1", name: "Datenbanken 1", semester: 2, cp: 5, graded: true },
      { id: "math2", name: "Mathematik für Wirtschaftsinformatik 2", semester: 2, cp: 5, graded: true },
      { id: "buch", name: "Buchführung und Jahresabschluss", semester: 2, cp: 5, graded: true },
      { id: "vwl", name: "Angewandte Mikro- und Makroökonomie", semester: 2, cp: 5, graded: true },

      { id: "progk", name: "Programmierkurs", semester: 3, cp: 5, graded: true },
      { id: "swt1", name: "Softwaretechnik 1", semester: 3, cp: 5, graded: true },
      { id: "math3", name: "Mathematik für Wirtschaftsinformatik 3", semester: 3, cp: 5, graded: true },
      { id: "ker", name: "Kosten-, Erlös- und Ergebnisrechnung", semester: 3, cp: 5, graded: true },
      { id: "gpm", name: "Grundlagen des Geschäftsprozessmanagements", semester: 3, cp: 5, graded: true },
      { id: "teng", name: "Technisches Englisch", semester: 3, cp: 2.5, graded: false },
      { id: "semm", name: "Seminar (Methodik) / Studium Generale", semester: 3, cp: 2.5, graded: false },

      { id: "swt2", name: "Softwaretechnik 2", semester: 4, cp: 5, graded: true },
      { id: "web", name: "Web-Technologien", semester: 4, cp: 5, graded: true },
      { id: "erp1", name: "ERP 1", semester: 4, cp: 5, graded: true },
      { id: "abwl", name: "Angewandte BWL (choose 1 of 2)", semester: 4, cp: 5, graded: true, choice: APPLIED_BWL_CHOICES },
      { id: "digi", name: "Einfluss der Digitalisierung auf Unternehmensorganisation und Change Management", semester: 4, cp: 2.5, graded: true },
      { id: "recht", name: "DV-Recht", semester: 4, cp: 5, graded: true },
      { id: "semi", name: "Seminar (Inhalt)", semester: 4, cp: 2.5, graded: true },

      { id: "erp2", name: "ERP 2", semester: 5, cp: 5, graded: true },
      { id: "pm", name: "Projektmanagement", semester: 5, cp: 5, graded: true },
      { id: "ibpm", name: "Informations- und Business Performance Management", semester: 5, cp: 5, graded: true },
      { id: "wp1", name: "Elective Wirtschaftsinformatik 1", semester: 5, cp: 5, graded: true, choice: ELECTIVE_CATALOG },
      { id: "wp2", name: "Elective Wirtschaftsinformatik 2", semester: 5, cp: 5, graded: true, choice: ELECTIVE_CATALOG },

      { id: "wp3", name: "Elective Wirtschaftsinformatik 3", semester: 6, cp: 5, graded: true, choice: ELECTIVE_CATALOG },
      { id: "proj", name: "Projektarbeit (may also be split 5 + 10 CP)", semester: 6, cp: 15, graded: true },
      { id: "thesis", name: "Thesis und Kolloquium", semester: 6, cp: 15, graded: true, thesis: true }
    ]
  },

  "wi7": {
    title: "Wirtschaftsinformatik B.Sc. with Praxissemester (7 semesters, 210 CP)",
    totalCp: 210,
    modules: [
      { id: "prog1", name: "Einführung in die Programmierung", semester: 1, cp: 5, graded: true },
      { id: "itinf", name: "IT-Infrastruktur", semester: 1, cp: 2.5, graded: true },
      { id: "ewi1", name: "Einführung in die Wirtschaftsinformatik 1", semester: 1, cp: 5, graded: true },
      { id: "math1", name: "Analysis", semester: 1, cp: 5, graded: true },
      { id: "bwl", name: "Allgemeine BWL/Unternehmensführung", semester: 1, cp: 5, graded: true },
      { id: "hrm", name: "Human Resource Management und Organisation", semester: 1, cp: 5, graded: true },
      { id: "lat", name: "Lern- u. Arbeitstechniken / Studium Generale / Mentoring", semester: 1, cp: 2.5, graded: false },

      { id: "algo", name: "Algorithmen und Datenstrukturen", semester: 2, cp: 5, graded: true },
      { id: "ewi2", name: "Einführung in die Wirtschaftsinformatik 2", semester: 2, cp: 5, graded: true },
      { id: "db1", name: "Datenbanken 1", semester: 2, cp: 5, graded: true },
      { id: "math2", name: "Lineare Algebra", semester: 2, cp: 5, graded: true },
      { id: "buch", name: "Buchführung und Jahresabschluss", semester: 2, cp: 5, graded: true },
      { id: "vwl", name: "Angewandte Mikro- und Makroökonomie", semester: 2, cp: 5, graded: true },

      { id: "progk", name: "Programmierkurs", semester: 3, cp: 5, graded: true },
      { id: "swt1", name: "Softwaretechnik 1", semester: 3, cp: 5, graded: true },
      { id: "math3", name: "Statistik", semester: 3, cp: 5, graded: true },
      { id: "ker", name: "Kosten-, Erlös- und Ergebnisrechnung", semester: 3, cp: 5, graded: true },
      { id: "gpm", name: "Grundlagen des Geschäftsprozessmanagements", semester: 3, cp: 5, graded: true },
      { id: "teng", name: "Technisches Englisch", semester: 3, cp: 2.5, graded: false },
      { id: "semm", name: "Seminar (Methodik) / Studium Generale", semester: 3, cp: 2.5, graded: false },

      { id: "swt2", name: "Softwaretechnik 2", semester: 4, cp: 5, graded: true },
      { id: "web", name: "Web-Technologien", semester: 4, cp: 5, graded: true },
      { id: "erp1", name: "ERP 1", semester: 4, cp: 5, graded: true },
      { id: "abwl", name: "Angewandte BWL (choose 1 of 2)", semester: 4, cp: 5, graded: true, choice: APPLIED_BWL_CHOICES },
      { id: "digi", name: "Einfluss der Digitalisierung auf Unternehmensorganisation und Change Management", semester: 4, cp: 2.5, graded: true },
      { id: "recht", name: "DV-Recht", semester: 4, cp: 5, graded: true },
      { id: "semi", name: "Seminar (Inhalt)", semester: 4, cp: 2.5, graded: true },

      { id: "erp2", name: "ERP 2", semester: 5, cp: 5, graded: true },
      { id: "pm", name: "Projektmanagement", semester: 5, cp: 5, graded: true },
      { id: "ibpm", name: "Informations- und Business Performance Management", semester: 5, cp: 5, graded: true },
      { id: "wp1", name: "Elective Wirtschaftsinformatik 1", semester: 5, cp: 5, graded: true, choice: ELECTIVE_CATALOG },
      { id: "wp2", name: "Elective Wirtschaftsinformatik 2", semester: 5, cp: 5, graded: true, choice: ELECTIVE_CATALOG },
      { id: "wp3", name: "Elective Wirtschaftsinformatik 3", semester: 5, cp: 5, graded: true, choice: ELECTIVE_CATALOG },

      { id: "praxis", name: "Praxissemester (20 weeks) incl. Praxisseminar", semester: 6, cp: 30, graded: false },

      { id: "proj", name: "Projektarbeit", semester: 7, cp: 15, graded: true },
      { id: "thesis", name: "Thesis und Kolloquium", semester: 7, cp: 15, graded: true, thesis: true }
    ]
  }
};
