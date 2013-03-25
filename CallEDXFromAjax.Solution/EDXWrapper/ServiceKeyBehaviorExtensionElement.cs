using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Configuration;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;

namespace EDXWrapper
{
    class ServiceKeyBehaviorExtensionElement : BehaviorExtensionElement
    {
        public override Type BehaviorType
        {
            get { return typeof(ServiceKeyEndpointBehavior); }
        }

        protected override object CreateBehavior()
        {
            return new ServiceKeyEndpointBehavior();
        }
    }

}