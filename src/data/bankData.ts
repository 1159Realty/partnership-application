import banks from "@/data/banks.json";
import nigerianBanks from "@/data/nigerianBanks.json";

const banksData = banks;
// const nigerianBanksData = nigerianBanks.map((x) => ({
//   name: x.description.trim(),
//   code: x.code.trim(),
//   country: "NG",
// }));

const nigerianBanksData = (() => {
  const groupedByName: Record<string, { name: string; code: string; country: string }[]> = {};

  // Step 1: Map, trim, and group by name
  const _baseList = nigerianBanks.map((x) => {
    const name = x.description.trim();
    const code = x.code.trim();
    const country = "NG";
    if (!groupedByName[name]) groupedByName[name] = [];
    groupedByName[name].push({ name, code, country });
    return { name, code, country };
  });

  // Step 2: Adjust duplicates
  const result: typeof _baseList = [];
  for (const [_, entries] of Object.entries(groupedByName)) {
    if (entries.length === 1) {
      result.push(entries[0]);
    } else {
      // Sort by code length (desc), preserve original order if same length
      const sorted = [...entries].sort((a, b) => b.code.length - a.code.length);

      sorted.forEach((entry, i) => {
        result.push({
          ...entry,
          name: `${entry.name} (${i + 1})`,
        });
      });
    }
  }

  return result;
})();

export { banksData, nigerianBanksData };
