(() => {
    const CHECK_INTERVAL = 60_000; // 1 minute

    let currentVersion = null;

    async function getVersion() {
        const response = await fetch(
            `/version.json?cacheBust=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                `Version check failed: HTTP ${response.status}`
            );
        }

        return await response.json();
    }

    async function checkForUpdate() {
        try {
            const data = await getVersion();

            if (currentVersion === null) {
                currentVersion = data.version;
                return;
            }

            if (data.version !== currentVersion) {
                console.log(
                    "[Update] New version detected. Reloading..."
                );

                window.location.reload();
            }
        } catch (error) {
            console.warn(
                "[Update] Could not check for updates:",
                error
            );
        }
    }

    // Get the initial version.
    checkForUpdate();

    // Check every minute.
    setInterval(
        checkForUpdate,
        CHECK_INTERVAL
    );
})();