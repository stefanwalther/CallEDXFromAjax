using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using EDXWrapper.QmsAPI;

namespace EDXWrapper
{
    public class WSResponse_EDXStatus
    {
        private EDXStatus _status = null;

        public void SetEDXStatus(EDXStatus status)
        {
            _status = status;
        }

        public string TaskStatus
        {
            get
            {
                return _status.TaskStatus.ToString();
            }
        }

        public string Summary 
        {
            get
            {
                return _status.Summary.ToString();
            }    
        }

        public string StartTime 
        {
            get 
            {
                return _status.StartTime;
            } 
        }

        public string Now
        {
            get
            {
                return DateTime.Now.ToString();
            }
        }
    }
}