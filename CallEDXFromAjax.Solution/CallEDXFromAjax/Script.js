
Qva.LoadCSS(Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + "Extensions/CallEDXFromAjax/lib/css/style.css");


Qva.AddExtension("CallEDXFromAjax",
        function () {



            // Extension Settings
            var _this = this;
            _this.ExtSettings = {};
            _this.ExtSettings.UniqueId = this.Layout.ObjectId.replace("\\", "_");
            _this.ExtSettings.ExecId = "";
            retrieveSettings();

            renderControl();


            function renderControl() {

                $(_this.Element).empty();
                var divExt = document.createElement("div");
                divExt.setAttribute("id", _this.ExtSettings.UniqueId);
                divExt.style.width = _this.GetWidth() - 10 + 'px';
                divExt.style.height = _this.GetHeight() + 'px';
                divExt.setAttribute("class", "CallEdxFromAjax_ExtensionContainer");

                
                var divButtonContainer = document.createElement("div");
                divButtonContainer.setAttribute("class", "CallEdxFromAjax_ButtonContainer")

                var divButton = document.createElement("a");
                divButton.setAttribute("href", "javascript:void(0);");
                divButton.setAttribute("id", "button_" + _this.ExtSettings.UniqueId);
                divButton.setAttribute("class", "CallEdxFromAjax_Button");
                divButton.innerText = _this.ExtSettings.ButtonLabel;
                divButton.addEventListener("click", button_click, false);
                divButtonContainer.appendChild(divButton);

                divExt.appendChild(divButtonContainer);

                var divOutputContainer = document.createElement("div");
                divOutputContainer.setAttribute("class", "CallEdxFromAjax_OutputContainer");

                var divTriggerStatus = document.createElement("div");
                divTriggerStatus.setAttribute("id", "triggerstatus_" + _this.ExtSettings.UniqueId);
                divTriggerStatus.setAttribute("class", "CallEdxFromAjax_TriggerStatus");
                divOutputContainer.appendChild(divTriggerStatus);

                var divStatus = document.createElement("div");
                divStatus.setAttribute("id", "status_" + _this.ExtSettings.UniqueId);
                divStatus.setAttribute("class", "CallEdxFromAjax_Status");
                divOutputContainer.appendChild(divStatus);

                divExt.appendChild(divOutputContainer);

                _this.Element.appendChild(divExt);

            }

            function setTriggerStatus(msg, className) {
                var divTriggerStatus = document.getElementById("triggerstatus_" + _this.ExtSettings.UniqueId);
                $(divTriggerStatus).empty();
                var output = document.createElement("div");
                output.setAttribute("class", className);
                output.innerText = msg;
                divTriggerStatus.appendChild(output);
            }

            function resetStatus() {
                var divOutput = document.getElementById("status_" + _this.ExtSettings.UniqueId);
                $(divOutput).empty();

            }

            function addToStatus(htmlElem) {

                var divStatus = document.getElementById("status_" + _this.ExtSettings.UniqueId);
                $(divStatus).empty();
                divStatus.appendChild(htmlElem);

            }

            function renderStatus(msg, className) {

                var output = document.createElement("div");
                output.setAttribute("class", className);
                output.innerText = msg;
                addToStatus(output);

            }

            function button_click() {

                var webServiceUrl = _this.ExtSettings.WebServiceUrl;
                callEDX(webServiceUrl);

            }

            function callEDX(webServiceUrl) {

                var qvData = getEDXTriggerObjects();
                ConsoleLog('Trigger EDX - ' + webServiceUrl, true);
                postData_TriggerEDX(_this.ExtSettings.WebServiceUrl, qvData);
                resetStatus();

                
            }

            function getEDXTriggerObjects() {

                var qvData = new Object();
                qvData.taskName = _this.ExtSettings.TaskName;
                qvData.password = _this.ExtSettings.TaskPassword;
                qvData.variableName = _this.ExtSettings.VariableName;
                qvData.variableValues = _this.ExtSettings.VariableValues;
                qvData.variableValueDelimiter = ","; //Todo: could be also configurable using the props ...

                return qvData;

            }

            function getEDXStatusObject() {

                var qvData = new Object();
                qvData.execId = _this.ExtSettings.ExecId;

                return qvData;

            }

            function retrieveSettings() {

                _this.ExtSettings.WebServiceUrl = getQVStringProp(0);
                _this.ExtSettings.ButtonLabel = getQVStringProp(1);
                _this.ExtSettings.TaskName = getQVStringProp(2);
                _this.ExtSettings.TaskPassword = getQVStringProp(3);
                _this.ExtSettings.ConfirmEdxTriggerStatus = getQVStringProp(4);
                _this.ExtSettings.EdxTrigger_Msg_Success = getQVStringProp(6);
                _this.ExtSettings.EdxTrigger_Msg_Error = getQVStringProp(7);
                _this.ExtSettings.StatusPollInterval = parseInt(getQVStringProp(8)) * 1000;
                if (_this.ExtSettings.StatusPollInterval == "")
                {
                    _this.ExtSettings.StatusPollInterval = 2000;
                }
                _this.ExtSettings.VariableName = getQVStringProp(9);
                _this.ExtSettings.VariableValues = getQVStringProp(10);
            }

            // ------------------------------------------------------------------
            // Webservice Calls
            // ------------------------------------------------------------------
            function postData_TriggerEDX(webServiceUrl, obj) {

                jQuery.support.cors = true;
                $.ajax({
                    type: "POST",
                    url: webServiceUrl + "/TriggerEDXTask",
                    data: JSON.stringify(obj), 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {

                        if (_this.ExtSettings.ConfirmEdxTriggerStatus == "1") {
                            if (msg.d.Succeeded == true) {
                                setTriggerStatus(msg.d.Now + ": " + _this.ExtSettings.EdxTrigger_Msg_Success, "CallEdxFromAjax_Output_green");

                                // Trigger fetching the status ever x seconds
                                _this.ExtSettings.ExecId = msg.d.ExecId;
                                ConsoleLog("ExecId: " + msg.d.ExecId);

                                setTimeout(getStatus, _this.ExtSettings.StatusPollInterval);

                            }
                            else {
                                setTriggerStatus(msg.d.Now + ": " + _this.ExtSettings.EdxTrigger_Msg_Error + "(" + msg.d.StatusMessage + ")", "CallEdxFromAjax_Output_red");
                            }
                        }
                        

                    },
                    error: function (xhr, ajaxOptions, thrownError) {

                        switch (xhr.status.toString()) {
                            case "404":
                                setTriggerStatus('Error 404 posting the data to the webservice!\n\nCould not find webservice at Url ' + _this.WebserviceUrl, "CallEdxFromAjax_Output_red");
                                break;

                            default:
                                setTriggerStatus('Error posting the data to the webservice:\n\n' + 'Error Status: ' + xhr.status + '\nError Status: ' + xhr.statusText, "CallEdxFromAjax_Output_red");
                                break;
                        }
                    }
                });

            }

            function getStatus() {

                var obj = getEDXStatusObject();
                postData_GetExecutionStatus(_this.ExtSettings.WebServiceUrl, obj);

            }

            function postData_GetExecutionStatus(webServiceUrl, obj) {

                jQuery.support.cors = true;
                $.ajax({
                    type: "POST",
                    url: webServiceUrl + "/GetEDXTaskStatus",
                    data: JSON.stringify(obj),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {

                        
                        if (msg.d.TaskStatus != "Completed") {
                            renderStatus(msg.d.Now + ": " + msg.d.TaskStatus);
                            setTimeout(getStatus, _this.ExtSettings.StatusPollInterval);
                        }
                        else {
                            renderStatus(msg.d.Now + ": " + msg.d.TaskStatus, "CallEdxFromAjax_Output_green");
                        }


                    },
                    error: function (xhr, ajaxOptions, thrownError) {

                        switch (xhr.status.toString()) {
                            case "404":
                                renderStatus('Error 404 posting the data to the webservice!\n\nCould not find webservice at Url ' + _this.WebserviceUrl, "CallEdxFromAjax_Output_red");
                                break;

                            default:
                                renderStatus('Error posting the data to the webservice:\n\n' + 'Error Status: ' + xhr.status + '\nError Status: ' + xhr.statusText, "CallEdxFromAjax_Output_red");
                                break;
                        }
                    }
                });
            }

            // ------------------------------------------------------------------
            // Debugging helper
            // ------------------------------------------------------------------
            function ConsoleLog(msg, enabled) {
                if (enabled && typeof console != "undefined") {
                    console.log(msg);
                }
            }

            function getQVStringProp(idx) {

                var p = '';
                if (eval('_this.Layout.Text' + idx)) {
                    p = eval('_this.Layout.Text' + idx + '.text');
                }
                return p;
            }

        }, false);
