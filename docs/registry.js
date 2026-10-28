// Skills registry — the choices offered in the sign-up form.
// Edit these lists to add trades, countries or languages; the form updates itself.

window.KOMARA_REGISTRY = {
  // Backend addresses. Leave them empty to run in preview mode, where nothing is
  // sent and the page shows what would happen (including made-up verification codes).
  //   endpoint          receives a new registration (JSON), e.g. a Formspree form
  //   sendCodeEndpoint  receives {channel: "email"|"phone", to} and sends a 6-digit code
  //   checkCodeEndpoint receives {channel, to, code} and answers 200 if it matches
  //   reportEndpoint    receives a contributor's report from the Reform steps
  endpoint: "",
  sendCodeEndpoint: "",
  checkCodeEndpoint: "",
  reportEndpoint: "",

  skills: {
    "Education": ["Primary school teacher", "Secondary school teacher", "Tutor", "Curriculum designer", "University lecturer", "Librarian", "Early childhood educator"],
    "Health": ["Nurse", "Physician", "Pharmacist", "Dentist", "Community health worker", "Mental health counselor", "Midwife", "Lab technician"],
    "Construction and trades": ["Electrician", "Plumber", "Carpenter", "Mason", "Welder", "HVAC technician", "Solar installer", "Heavy equipment operator", "General contractor"],
    "Agriculture and food": ["Farmer", "Agronomist", "Fisher", "Food processing", "Veterinarian", "Irrigation specialist"],
    "Engineering and technology": ["Civil engineer", "Electrical engineer", "Mechanical engineer", "Software developer", "IT and network technician", "Data analyst", "Auto mechanic"],
    "Business and finance": ["Accountant", "Entrepreneur", "Banking and finance", "Logistics and supply chain", "Sales and marketing", "Project manager"],
    "Law and public service": ["Lawyer", "Paralegal", "Public administrator", "Policy researcher", "Translator or interpreter", "Social worker"],
    "Culture and media": ["Musician", "Music producer", "Visual artist", "Filmmaker", "Writer or journalist", "Photographer", "Event producer", "Historian or archivist"]
  },

  experience: ["Less than 2 years", "2–5 years", "5–10 years", "10–20 years", "More than 20 years", "Retired, still practicing"],

  availability: ["A few hours a month", "About one day a month", "One week a year", "Remote only", "Open to travel"],

  countries: ["United States", "Haiti", "Burkina Faso", "Mali", "Niger", "Jamaica", "The Bahamas", "Trinidad and Tobago", "Barbados", "Dominican Republic", "Cuba", "Puerto Rico", "Brazil", "Colombia", "Panama", "Canada", "United Kingdom", "France", "Ghana", "Nigeria", "Senegal", "Côte d'Ivoire", "Other"],

  heritage: ["African American", "Haitian", "Burkinabè", "Malian", "Nigerien", "Jamaican", "Bahamian", "Trinidadian", "Barbadian", "Dominican", "Afro-Cuban", "Afro-Puerto Rican", "Afro-Brazilian", "Afro-Colombian", "Afro-Panamanian", "Nigerian", "Ghanaian", "Senegalese", "Ivorian", "Other"],

  languages: ["English", "Kreyòl", "French", "Spanish", "Portuguese", "Mooré", "Dioula", "Wolof", "Yoruba", "Twi"]
};
