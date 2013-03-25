using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Configuration;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;

namespace EDXWrapper
{
    class ServiceKeyEndpointBehavior : IEndpointBehavior
    {
        public void Validate(ServiceEndpoint endpoint) { }

        public void AddBindingParameters(ServiceEndpoint endpoint, BindingParameterCollection bindingParameters) { }

        public void ApplyDispatchBehavior(ServiceEndpoint endpoint, EndpointDispatcher endpointDispatcher) { }

        public void ApplyClientBehavior(ServiceEndpoint endpoint, ClientRuntime clientRuntime)
        {
            clientRuntime.MessageInspectors.Add(new ServiceKeyClientMessageInspector());
        }
    }

}