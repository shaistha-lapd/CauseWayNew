import Dexie from "dexie";

const db = new Dexie("Causeway");
db.version(3).stores({
  rdMap: "id",
  FIs: "id, [fi.data.status+fi.data.creator.serial]",
  Lookups: "id",
  User: "serial, settings",
  Employees: "serial, lastName, division",
});

db.on("populate", () => {
  db.User.add({
    serial: 0,
    outlined: false,
    dense: true,
    dark: true,
  });
});

export default db;
