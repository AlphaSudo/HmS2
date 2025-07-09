import os
import socket
import requests
import time
import logging
import threading
from .config import EUREKA_SERVER, SERVICE_NAME, SERVICE_PORT, SERVICE_HOST

logger = logging.getLogger(__name__)

class EurekaClient:
    def __init__(self, eureka_server: str, service_name: str, service_host: str, service_port: int):
        self.eureka_server = eureka_server
        self.service_name = service_name
        self.service_host = service_host
        self.service_port = service_port
        self.instance_id = f"{service_host}:{service_name}:{service_port}"
        
    def register(self):
        """Register service with Eureka"""
        registration_data = {
            "instance": {
                "instanceId": self.instance_id,
                "hostName": self.service_host,
                "app": self.service_name.upper(),
                "ipAddr": self.service_host,
                "status": "UP",
                "overriddenStatus": "UNKNOWN",
                "port": {"$": self.service_port, "@enabled": "true"},
                "securePort": {"$": 443, "@enabled": "false"},
                "countryId": 1,
                "dataCenterInfo": {
                    "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                    "name": "MyOwn"
                },
                "leaseInfo": {
                    "renewalIntervalInSecs": 30,
                    "durationInSecs": 90
                },
                "metadata": {
                    "management.port": str(self.service_port),
                    "service.type": "ai-prediction"
                },
                "homePageUrl": f"http://{self.service_host}:{self.service_port}/",
                "statusPageUrl": f"http://{self.service_host}:{self.service_port}/diabetes-prediction/health",
                "healthCheckUrl": f"http://{self.service_host}:{self.service_port}/diabetes-prediction/health",
                "vipAddress": self.service_name,
                "secureVipAddress": self.service_name,
                "isCoordinatingDiscoveryServer": "false",
                "lastUpdatedTimestamp": str(int(time.time() * 1000)),
                "lastDirtyTimestamp": str(int(time.time() * 1000))
            }
        }
        
        try:
            response = requests.post(
                f"{self.eureka_server}/apps/{self.service_name.upper()}",
                json=registration_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            if response.status_code in [200, 204]:
                logger.info(f"Successfully registered with Eureka: {self.instance_id}")
                return True
            else:
                logger.error(f"Failed to register with Eureka: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error registering with Eureka: {e}")
            return False
    
    def send_heartbeat(self):
        """Send heartbeat to Eureka"""
        try:
            response = requests.put(
                f"{self.eureka_server}/apps/{self.service_name.upper()}/{self.instance_id}",
                timeout=5
            )
            if response.status_code == 200:
                logger.debug("Heartbeat sent successfully")
                return True
            else:
                logger.warning(f"Heartbeat failed: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"Error sending heartbeat: {e}")
            return False
    
    def deregister(self):
        """Deregister from Eureka"""
        try:
            response = requests.delete(
                f"{self.eureka_server}/apps/{self.service_name.upper()}/{self.instance_id}",
                timeout=5
            )
            if response.status_code == 200:
                logger.info("Successfully deregistered from Eureka")
            else:
                logger.warning(f"Deregistration failed: {response.status_code}")
        except Exception as e:
            logger.error(f"Error deregistering: {e}")

eureka_client = EurekaClient(EUREKA_SERVER, SERVICE_NAME, SERVICE_HOST, SERVICE_PORT)

def heartbeat_worker():
    """Background thread for sending heartbeats"""
    while True:
        time.sleep(30)  # Send heartbeat every 30 seconds
        eureka_client.send_heartbeat() 