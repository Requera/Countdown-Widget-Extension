define(["require", "exports"], function (require, exports) {
    "use strict";
    var TelemetryClient = (function () {
        function TelemetryClient() {
        }
        TelemetryClient.getClient = function () {
            if (!this.telemetryClient) {
                this.telemetryClient = new TelemetryClient();
                this.telemetryClient.Init();
            }
            return this.telemetryClient;
        };
        TelemetryClient.prototype.Init = function () {
            try {
                var snippet = {
                    config: {
                        instrumentationKey: "0a613896-60eb-45d6-bd40-e85cb8e7b70e"
                    }
                };
                var x = VSS.getExtensionContext();
                var init = new Microsoft.ApplicationInsights.Initialization(snippet);
                this.appInsightsClient = init.loadAppInsights();
                var webContext = VSS.getWebContext();
                this.appInsightsClient.setAuthenticatedUserContext(webContext.user.id, webContext.collection.id);
            }
            catch (e) {
                this.appInsightsClient = null;
                console.log(e);
            }
        };
        TelemetryClient.prototype.startTrackPageView = function (name) {
            try {
                if (this.appInsightsClient != null) {
                    this.appInsightsClient.startTrackPage(name);
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryClient.prototype.stopTrackPageView = function (name) {
            try {
                if (this.appInsightsClient != null) {
                    this.appInsightsClient.stopTrackPage(name);
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryClient.prototype.trackPageView = function (name, url, properties, measurements, duration) {
            try {
                if (this.appInsightsClient != null) {
                    this.appInsightsClient.trackPageView("CountdownWidget." + name, url, properties, measurements, duration);
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryClient.prototype.trackEvent = function (name, properties, measurements) {
            try {
                if (this.appInsightsClient != null) {
                    this.appInsightsClient.trackEvent("CountdownWidget." + name, properties, measurements);
                    this.appInsightsClient.flush();
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryClient.prototype.trackException = function (exception, handledAt, properties, measurements) {
            try {
                if (this.appInsightsClient != null) {
                    this.appInsightsClient.trackException(exception, handledAt, properties, measurements);
                    this.appInsightsClient.flush();
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryClient.prototype.trackMetric = function (name, average, sampleCount, min, max, properties) {
            try {
                if (this.appInsightsClient != null) {
                    this.appInsightsClient.trackMetric("CountdownWidget." + name, average, sampleCount, min, max, properties);
                    this.appInsightsClient.flush();
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        return TelemetryClient;
    }());
    exports.TelemetryClient = TelemetryClient;
});
//# sourceMappingURL=TelemetryClient.js.map