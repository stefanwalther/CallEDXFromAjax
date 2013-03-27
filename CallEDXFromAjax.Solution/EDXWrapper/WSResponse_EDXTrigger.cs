#region Using Directives
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web; 
#endregion

namespace EDXWrapper
{
    public class WSResponse_EDXTrigger
    {

        

        public bool Succeeded { get; set; }

        /// <summary>
        /// Status for the Webservice. Either "Success" or another status message by the EDX trigger.
        /// Will return "Error"
        /// </summary>
        public string StatusMessage { get; set; }

        public string ErrorSource { get; set; }
        public string ErrorMessage { get; set; }

        public string ReturnMessage { get; set; }

        public string ExecId { get; set; }

        public string Now
        {
            get
            {
                return DateTime.Now.ToString();
            }
        }

        /// <summary>
        /// Exception while processing the request. If the webservice is successful, Exception is null.
        /// </summary>
        //public Exception Exception { get; set; }


        /// <summary>
        /// Additional return values.
        /// </summary>
        //public System.Collections.Hashtable ReturnValues { get; set; }

    }
}