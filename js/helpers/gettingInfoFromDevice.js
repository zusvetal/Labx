var GettingInfoFromDevice = function (modelName, ip) {
    var
            patternPVR8K = /pvr.[8]\d{2,3}/i,
            patternPVR7K = /pvr.[7]\d{2,3}/i,
            patternPVR2900 = /pvr.2\d{2,3}/i,
            patternEllipse = /ellipse.[123]\d{2,3}/i,
            patternCisco = /cisco.\w*[3]\d{2,3}[\w\s-]*/i,
            patternJuniper = /juniper.[\w\s-]*/i,
            patternProsrteam1000 = /prostream.1000/i,
            patternProsrteam9000 = /prostream.9[0,1]00/i,
            patternEnensys = /enensys.[\w\s\d]*/i,
            patternProstreamPsm3600 = /Newtec AZ110/i,
            patternPDU = /switched pdu.[\w\s\d]/i,
            patternNSG_Pro = /nsg[\s,-]pro/i,
            patternNSG9000_40G = /nsg[\s,-]*9000[\s,-]40g/i,
            patternNSG9000_6G = /nsg[\s,-]*9000[\s,-]6g/i,
            scriptPath;
    this.modelName = modelName;
    this.ip = ip;
    this.abilityGettingInfo = true;
    if (patternPVR8K.test(modelName)) {
        this.scriptPath = "/snmp/pvr_8k";
    }
    else if (patternPVR7K.test(modelName)) {
        this.scriptPath = "/snmp/pvr_7k";
    }
    else if (patternPVR2900.test(modelName)) {
        this.scriptPath = "/snmp/pvr_2900";
    }
    else if (patternEllipse.test(modelName)) {
        this.scriptPath = "/snmp/ellipse";
    }
    else if (patternCisco.test(modelName)) {
        this.scriptPath = "/snmp/cisco";
    }
    else if (patternJuniper.test(modelName)) {
        this.scriptPath = "/snmp/juniper";
    }
    else if (patternProsrteam1000.test(modelName)) {
        this.scriptPath = "/snmp/prostream1000";
    }
    else if (patternProsrteam9000.test(modelName)) {
        this.scriptPath = "/xml/prostream9000";
    }
    else if (patternEnensys.test(modelName)) {
        this.scriptPath = "/snmp/enensys";
    }
    else if (patternProstreamPsm3600.test(modelName)) {
        this.scriptPath = "/snmp/prostream_psm_3600";
    }
    else if (patternNSG9000_6G.test(modelName)) {
        this.scriptPath = "/snmp/nsg9000_6g";
    }
    else if (patternNSG9000_40G.test(modelName)) {
        this.scriptPath = "/snmp/nsg9000_40g";
    }
    else if (patternNSG_Pro.test(modelName)) {
        this.scriptPath = "/snmp/nsg_pro";
    }
    else if (patternPDU.test(modelName)) {
        this.scriptPath = "/snmp/pdu";
    }
    else {
        this.abilityGettingInfo = false;
    }

    this.general = function (callback) {
        return  $.post(
                this.scriptPath,
                {
                    get_info: '1',
                    ip: this.ip
                },
        callback,
                "json"
                );
    };

    this.getModulesInfo = function (callback) {
        return $.post(
                this.scriptPath,
                {
                    get_modules_info: '1',
                    ip: this.ip
                },
        callback,
                "json"
                );
    };

    this.sn = function () {
        return $.ajax({
            url: this.scriptPath,
            async: false,
            type: "POST",
            data: {
                get_sn: '1',
                ip: this.ip
            },
            dataType: "text"
        }).responseText.trim();
    };
};