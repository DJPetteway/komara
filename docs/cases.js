// The Thread — the curriculum's spine. One chronological line of cases.
// Each case is a claim the learner judges before seeing the evidence.
// verdict: "supported" | "partly" | "not"
// chapter: the module in modules.js that goes deeper.
// next: how this case leads to the one after it.

window.KOMARA_CASES = [
  {
    id: "c-florida-14000",
    year: "14,550 years ago",
    chapter: "first-americans",
    claim: "People were living in Florida more than 14,000 years ago.",
    evidence: [
      ["At the Page-Ladson site in the Aucilla River, divers found stone tools beside mastodon bones dated to about 14,550 years ago.", "Halligan et al., Science Advances, 2016"],
      ["Monte Verde in Chile shows people had reached South America by about 14,500 years ago.", "Dillehay, Monte Verde excavations"]
    ],
    counter: "For decades textbooks said the first Americans were the Clovis people, about 13,000 years ago. Dating finds from underwater sites is difficult, so some researchers asked for more proof.",
    verdict: "supported",
    verdictText: "The Page-Ladson dates have held up. Florida was home to people before the end of the last Ice Age.",
    next: "Most first Americans came from northeast Asia. DNA has turned up a surprise about who else they were related to."
  },
  {
    id: "c-melanesia",
    year: "Deep ancestry",
    chapter: "first-americans",
    claim: "Some Indigenous peoples of the Amazon share ancestry with Melanesians.",
    evidence: [
      ["The Suruí and Karitiana carry a small share of ancestry closer to Melanesians, Aboriginal Australians and Andaman Islanders than to other Native Americans.", "Skoglund et al., Nature, 2015"],
      ["A trace of the same signal appears in an ancient individual from Lagoa Santa, Brazil.", "Moreno-Mayar et al., Science, 2018"]
    ],
    counter: "The share is small, and it does not mean anyone sailed across the Pacific. Most researchers think it arrived through Beringia with one of the founding groups.",
    verdict: "supported",
    verdictText: "The genetic link is real. How it got to the Amazon is still unsolved.",
    next: "Did anyone cross an ocean to reach the Americas before Columbus?"
  },
  {
    id: "c-africa-before-columbus",
    year: "Before 1492",
    chapter: "first-americans",
    claim: "Africans reached the Americas before Columbus.",
    evidence: [
      ["The Arab writer al-Umari recorded that Mansa Musa of Mali said his predecessor sent a fleet into the Atlantic, and it did not return.", "al-Umari, 14th century"],
      ["No archaeological site, burial or DNA in the Americas has yet shown African presence before 1492.", "Archaeological and genetic surveys"],
      ["The Olmec stone heads, often cited, are generally read by archaeologists as portraits of Olmec rulers.", "Mesoamerican archaeology"]
    ],
    counter: "Ivan Van Sertima’s They Came Before Columbus (1976) argued from resemblances in art, plants and accounts like Mali’s. Absence of evidence is not proof that it never happened.",
    verdict: "not",
    verdictText: "Not supported by evidence so far. The Mali voyage is a real historical account, but no one has found proof that the ships arrived. That would take a site, a burial or DNA.",
    next: "Columbus crossed in 1492. Twenty-one years later, a Spanish expedition reached Florida and began writing about it."
  },
  {
    id: "c-fountain",
    year: "1513",
    chapter: "florida-explorers",
    claim: "Ponce de León came to Florida looking for the Fountain of Youth.",
    evidence: [
      ["His 1512 royal contract from the Spanish crown concerned finding and settling new lands, with rights to gold and labor.", "Royal capitulation of 1512"],
      ["The Fountain of Youth appears only in accounts written decades after his voyage.", "Oviedo (1535), Herrera (1601)"]
    ],
    counter: "Stories of a healing spring did circulate in the Caribbean, and later writers may have been recording real rumors.",
    verdict: "not",
    verdictText: "Not supported. Records from his own time are about land, gold and governorship. The fountain was added to his story later.",
    next: "His expeditions opened Florida to others, and Africans were among them from the start."
  },
  {
    id: "c-estevanico",
    year: "1528–1536",
    chapter: "florida-explorers",
    claim: "An African was among the first outsiders to cross North America.",
    evidence: [
      ["The Narváez expedition landed near Tampa Bay in 1528. Only four men survived the eight-year journey to Mexico City.", "Cabeza de Vaca, La Relación, 1542"],
      ["Cabeza de Vaca names one of the four as Estevanico, “an Arab Black from Azamor,” a town in Morocco.", "Cabeza de Vaca, La Relación, 1542"]
    ],
    counter: "We know Estevanico only through others’ writing, and the Spanish accounts give him little credit.",
    verdict: "supported",
    verdictText: "Supported. Estevanico was one of the first four outsiders known to cross the continent.",
    next: "Over the next century, Spain built St. Augustine, and enslaved Africans were brought to its colonies and to England’s. Some of them found a way out."
  },
  {
    id: "c-ran-south",
    year: "1693–1763",
    chapter: "spain-france-florida",
    claim: "In the 1700s, the road to freedom for enslaved people in the Southeast ran south, to Florida.",
    evidence: [
      ["In 1693 Spain promised freedom to people escaping slavery in the English colonies who accepted Catholicism.", "Spanish royal decree, 1693"],
      ["In 1738 Spain founded Fort Mose, a free Black town led by Captain Francisco Menéndez.", "Landers, Black Society in Spanish Florida, 1999"],
      ["The Stono Rebellion rebels of 1739 were reportedly headed for Spanish Florida.", "South Carolina colonial records"]
    ],
    counter: "Spain also held slaves. Freedom came with conditions: conversion and militia service. And the numbers were small, a few hundred people.",
    verdict: "supported",
    verdictText: "Supported, with conditions. For nearly a century, Spanish Florida was the main refuge for people escaping slavery in the Carolinas and Georgia.",
    next: "Florida was one prize in a wider contest between empires. Far to the north, a confederacy of Native nations played the same empires against each other."
  },
  {
    id: "c-haudenosaunee",
    year: "1744–1788",
    chapter: "haudenosaunee",
    claim: "The Haudenosaunee (Iroquois) Confederacy shaped the US Constitution.",
    evidence: [
      ["In 1744 the Onondaga speaker Canasatego urged the colonies to unite as the Five Nations had. Benjamin Franklin printed his words.", "Treaty of Lancaster, 1744"],
      ["In 1988 the US Congress passed a resolution recognizing the Confederacy’s influence on the Constitution.", "H.Con.Res. 331, 1988"]
    ],
    counter: "The records of the 1787 Constitutional Convention barely mention the Haudenosaunee. The framers cited European and classical models far more often.",
    verdict: "partly",
    verdictText: "Partly supported. Colonists knew and admired the Confederacy, and it encouraged the idea of union. Direct influence on the Constitution’s text is hard to show.",
    next: "Britain won the war for North America in 1763. Thirty years later, the greatest challenge to slavery in the Americas began in a French colony."
  },
  {
    id: "c-haiti-first",
    year: "1791–1804",
    chapter: "haitian-revolution",
    claim: "Haiti was the first nation founded by people who freed themselves from slavery.",
    evidence: [
      ["About 500,000 enslaved people in Saint-Domingue rose up in 1791 and defeated French, Spanish and British forces.", "Dubois, Avengers of the New World, 2004"],
      ["Haiti declared independence on 1 January 1804.", "Haitian Declaration of Independence, 1804"]
    ],
    counter: "Maroon communities won freedom earlier, among them Palmares in Brazil and the maroons of Jamaica, who forced a treaty from Britain in 1739. But none became an independent nation recognized as a state.",
    verdict: "supported",
    verdictText: "Supported. Haiti was the first independent nation founded by people who had freed themselves. The maroons were its forerunners.",
    next: "Haiti’s victory reached far beyond the island. It changed the map of the United States."
  },
  {
    id: "c-louisiana",
    year: "1803",
    chapter: "louisiana-florida",
    claim: "The United States doubled in size because of the Haitian Revolution.",
    evidence: [
      ["Napoleon planned a new American empire, with Saint-Domingue as its source of wealth and Louisiana as its supplier.", "White, Encountering Revolution, 2010"],
      ["His army in Saint-Domingue was destroyed by war and yellow fever. In 1803 he sold all of Louisiana for $15 million.", "Louisiana Purchase Treaty, 1803"]
    ],
    counter: "Napoleon also needed money for a coming war with Britain and could not defend Louisiana against the British navy. There were several causes.",
    verdict: "partly",
    verdictText: "Largely supported. Haiti was a major cause of the sale, though not the only one.",
    next: "Florida was not part of the purchase. Haiti’s new rulers, meanwhile, had to decide what the new nation would be."
  },
  {
    id: "c-dessalines-black",
    year: "1805",
    chapter: "dessalines",
    claim: "Haiti’s 1805 constitution made “Black” a citizenship anyone could hold.",
    evidence: [
      ["Article 14 declared that all Haitians would be known as “Black,” whatever their color.", "Haitian Constitution of 1805"],
      ["The same constitution naturalized some Germans and Poles who had fought on the Haitian side.", "Haitian Constitution of 1805"]
    ],
    counter: "The constitution also barred white foreigners from owning property. It followed the 1804 killings of most remaining French colonists, ordered by Dessalines.",
    verdict: "supported",
    verdictText: "Supported. Blackness became a political identity open to those who joined the nation. Dessalines’s full record includes both this and the 1804 killings.",
    next: "Meanwhile the United States was pushing into Spanish Florida, where the refuge Spain had created still stood."
  },
  {
    id: "c-prospect-bluff",
    year: "1816",
    chapter: "louisiana-florida",
    claim: "The US destroyed a free Black community in Florida before it owned Florida.",
    evidence: [
      ["A fort at Prospect Bluff on the Apalachicola River, in Spanish Florida, was held by hundreds of people who had escaped slavery and their Native allies.", "Millett, The Maroons of Prospect Bluff, 2013"],
      ["In July 1816 US forces attacked. A heated cannonball hit the powder magazine and the explosion killed about 270 people.", "US military reports, 1816"]
    ],
    counter: "US officials said the fort threatened shipping and drew enslaved people away from Georgia plantations. To them, it was a military threat.",
    verdict: "supported",
    verdictText: "Supported. Florida was still Spanish territory. The US took it from Spain five years later, in 1821.",
    next: "Florida’s refuge was gone, and Haiti faced a different kind of attack. France sent warships to collect a price for its freedom."
  },
  {
    id: "c-ransom",
    year: "1825",
    chapter: "haitian-revolution",
    claim: "Haiti was forced to pay for its own freedom.",
    evidence: [
      ["In 1825 King Charles X demanded 150 million francs to compensate former slaveholders, in exchange for recognition. French warships waited offshore.", "Royal ordinance of 1825"],
      ["Haiti borrowed from French banks to pay. A 2022 investigation estimated the long-term cost to its economy at $21–115 billion.", "The New York Times, “The Ransom,” 2022"]
    ],
    counter: "France presented the payment as compensation for lost property, and Haiti’s government signed the agreement, though under threat. The sum was later reduced to 90 million francs.",
    verdict: "supported",
    verdictText: "Supported. Haiti paid former slaveholders for its own freedom, for generations.",
    next: "A century and a half later, in West Africa, another leader argued that debt was the new chain."
  },
  {
    id: "c-sankara-life",
    year: "1983–1987",
    chapter: "sankara",
    claim: "Thomas Sankara’s revolution improved life for ordinary people in Burkina Faso.",
    evidence: [
      ["A 1984 campaign vaccinated about 2.5 million children in weeks.", "Peterson, Thomas Sankara, 2021"],
      ["His government banned forced marriage and female genital cutting, and ran literacy and tree-planting campaigns.", "Peterson, Thomas Sankara, 2021"]
    ],
    counter: "There were no elections. Revolutionary committees abused their power, more than a thousand striking teachers were fired, and unions were suppressed.",
    verdict: "partly",
    verdictText: "Partly supported. Health, women’s rights and self-reliance made real gains. Freedom of speech and political rights lost ground.",
    next: "In 1987 Sankara told Africa’s leaders not to pay their debts. Months later he was dead."
  },
  {
    id: "c-sankara-debt",
    year: "1987",
    chapter: "sankara",
    claim: "Sankara was killed because of his speech against debt.",
    evidence: [
      ["On 29 July 1987 he told the Organisation of African Unity that Africa’s debt should not be repaid.", "Thomas Sankara Speaks"],
      ["He was killed on 15 October 1987. In 2022 a court in Ouagadougou convicted Blaise Compaoré and others for the killing.", "Military tribunal, Ouagadougou, 2022"]
    ],
    counter: "Many believe foreign powers wanted him gone because of his stand on debt. The trial did not establish foreign involvement or tie the killing to the speech.",
    verdict: "not",
    verdictText: "Not proven. The speech and the killing are both facts; the link between them has not been shown. It remains an open question.",
    next: "The thread continues with you. The connected story is still being written."
  }
];
