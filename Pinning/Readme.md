# Pinning Service 📍

To make and host your own IPFS node that will act as the pinning service.

## Tech Used

- Digital Ocean or AWS (or any cloud provider)
- IPFS
- Shell Script

## Procedure

- **Deploy a virtual machine on the cloud**
- **Spin it up and configure it for ssh**
- **Create a new user (to keep the root access away from main node)**

```sh
adduser kylo
usermod -aG sudo kylo
id kylo

# uid=1000(kylo) gid=1000(kylo) groups=1000(kylo),27(sudo),100(users)

[IMP] : If you are using digital ocean as cloud provider you need to manually launch the droplet console using the user 'kylo'

# Adding the SSH key for user kylo

su - kylo
mkdir ~/.ssh
chmod 700 ~/.ssh

# Here paste the public key which you used in the initial deployment
vim ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

- **Add the firewall**
- **Install the IPFS node**

```sh
wget https://dist.ipfs.tech/kubo/v0.22.0/kubo_v0.22.0_linux-amd64.tar.gz
tar -xvzf kubo_v0.22.0_linux-amd64.tar.gz
cd kubo
sudo bash install.sh
ipfs --version
```

- **Update IPFS**

```sh
ipfs-update install latest
```

- **Init IPFS**

```sh
ipfs init --profile server
ipfs daemon # to run
```

- **Creating the server (IPFS)**

```sh
vim /etc/systemd/system/ipfs.service

# paste the content give below in the above file

[Unit]
Description=IPFS Daemon
[Service]
ExecStart=/usr/local/bin/ipfs daemon --enable-gc
Restart=always
Environment="IPFS_PATH=/root/.ipfs"
[Install]
WantedBy=multi-user.target
```

- **Enable System Service**

```sh
systemctl daemon-reload
systemctl enable ipfs
systemctl start ipfs
systemctl status ipfs

● ipfs.service - IPFS Daemon
     Loaded: loaded (/etc/systemd/system/ipfs.service; enabled; preset: enabled)
     Active: active (running) since Tue 2023-09-26 15:34:34 UTC; 7s ago
   Main PID: 5151 (ipfs)
      Tasks: 8 (limit: 4642)
     Memory: 64.3M
        CPU: 1.160s
     CGroup: /system.slice/ipfs.service
             └─5151 /usr/local/bin/ipfs daemon --enable-gc

Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Swarm announcing /ip4/159.89.162.56/udp/4001/quic-v1
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Swarm announcing /ip4/159.89.162.56/udp/4001/quic-v1/webtransport/certhash/uEiAMqYVJKbsEDRMPrC3v-bFFFD4Tj4A0Abw3xJum0sqBcw/certhash/uEiC2-gKQ7ts1dr9>
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Swarm announcing /ip6/::1/tcp/4001
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Swarm announcing /ip6/::1/udp/4001/quic
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Swarm announcing /ip6/::1/udp/4001/quic-v1
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Swarm announcing /ip6/::1/udp/4001/quic-v1/webtransport/certhash/uEiAMqYVJKbsEDRMPrC3v-bFFFD4Tj4A0Abw3xJum0sqBcw/certhash/uEiC2-gKQ7ts1dr9_x0stTqC0y>
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: RPC API server listening on /ip4/127.0.0.1/tcp/5001
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: WebUI: http://127.0.0.1:5001/webui
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Gateway server listening on /ip4/127.0.0.1/tcp/8080
Sep 26 15:34:35 ubuntu-s-2vcpu-4gb-blr1-01 ipfs[5151]: Daemon is ready
```

## Pinning Stuff

```sh
ipfs pin add -r --progress QmWcLKHWqrRB95zQnb4vX8RRgoGsVm5YAUHyZyiAw4mCMQ
```

Exposing our gateway

```sh
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
systemctl restart ipfs
```
