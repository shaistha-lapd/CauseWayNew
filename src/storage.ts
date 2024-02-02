import Dexie from "dexie";

class CausewayDatabase extends Dexie {
  rdMap!: Dexie.Table<{ id: number }, number>;
  FIs!: Dexie.Table<
    { id: number; data: { status: string; creator: { serial: number } } },
    number
  >;
  Lookups!: Dexie.Table<{ id: number }, number>;
  User!: Dexie.Table<
    {
      serial: number;
      settings: { outlined: boolean; dense: boolean; dark: boolean };
    },
    number
  >;
  Employees!: Dexie.Table<
    { serial: number; lastName: string; division: string },
    number
  >;

  constructor() {
    super("Causeway");

    this.version(3).stores({
      rdMap: "id",
      FIs: "id, [fi.data.status+fi.data.creator.serial]",
      Lookups: "id",
      User: "serial, settings",
      Employees: "serial, lastName, division",
    });

    this.on("populate", () => {
      this.User.add({
        serial: 0,
        settings: {
          outlined: false,
          dense: true,
          dark: true,
        },
      });
    });
  }
}

const db = new CausewayDatabase();

export default db;
