export async function settings(bot) {
  if (!global.db?.data) return;

  const defaults = {
    status: Date.now(),
        multi: true,
        prefix: "!",
        public: true,
        autoBio: false,
        aiPrivate: false,
        setmenu: "thumbnail",
        respontype: "auto",
        style: "normal",
        language: "auto"
  };

  if (!global.db.data.settings) {
    global.db.data.settings = defaults;
    await global.safeWriteDB();
  }

  for (const k in defaults) {
    if (global.db.data.settings[k] === undefined) {
      global.db.data.settings[k] = defaults[k];
    }
  }

 // global.settings = global.db.data.settings;
}

