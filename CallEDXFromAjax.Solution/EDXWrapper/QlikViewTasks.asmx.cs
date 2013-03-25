using EDXWrapper.QmsAPI;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace EDXWrapper
{
    /// <summary>
    /// Summary description for QlikViewTasks
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class QlikViewTasks : System.Web.Services.WebService
    {

        [WebMethod(false)]
        public WSResponse_EDXTrigger TriggerEDXTask(string taskName, string password, string variableName, string variableValues, string variableValueDelimiter = ",")
        {
            WSResponse_EDXTrigger retVal = new WSResponse_EDXTrigger();

            QmsAPI.QMSClient apiClient = new QmsAPI.QMSClient();

            // retrieve a time limited service key
            ServiceKeyClientMessageInspector.ServiceKey = apiClient.GetTimeLimitedServiceKey();

            // get a list of QVS services
            ServiceInfo qvsService = apiClient.GetServices(ServiceTypes.QlikViewDistributionService).FirstOrDefault();

            if (qvsService != null)
            {
                // run it on the first QlikView Distribution Service available
                List<string> variableValueList = new List<string>();
                TriggerEDXTaskResult result = apiClient.TriggerEDXTask(qvsService.ID, taskName, password, string.Empty, null);
                Guid execId = result.ExecId;

                if (result.EDXTaskStartResult == EDXTaskStartResult.Success)
                {
                    retVal.Succeeded = true;
                }
                else
                {
                    retVal.Succeeded = false;
                }
                retVal.StatusMessage = result.EDXTaskStartResult.ToString();
                retVal.ExecId = (result.ExecId != Guid.Empty) ? result.ExecId.ToString() : null;


                Debug.WriteLine("EDXTaskStartResult: " + result.EDXTaskStartResult.ToString());
                Debug.WriteLine("ExecId: " + execId);
                Debug.WriteLine("~~");
            }
            else
            {
                retVal.Succeeded = false;
                retVal.StatusMessage = "No Distribution service found.";
                
            }
            return retVal;
        }

        [WebMethod(false)]
        public WSResponse_EDXStatus GetEDXTaskStatus(Guid execId)
        {
            QmsAPI.QMSClient apiClient = new QmsAPI.QMSClient();

            // retrieve a time limited service key
            ServiceKeyClientMessageInspector.ServiceKey = apiClient.GetTimeLimitedServiceKey();

            ServiceInfo qdsService = apiClient.GetServices(ServiceTypes.QlikViewDistributionService).FirstOrDefault();

            if (qdsService != null)
            {
                EDXStatus executionStatus = null;
                executionStatus = apiClient.GetEDXTaskStatus(qdsService.ID, execId);
                WSResponse_EDXStatus retVal = new WSResponse_EDXStatus(executionStatus);
                return retVal;
            }
            return null;        
        }

      
    }
}
