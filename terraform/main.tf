terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}



resource "tls_private_key" "agent_key" {
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "aws_key_pair" "agent_keypair" {
  key_name = "builder_instance_keypair"
  public_key = tls_private_key.agent_key.public_key_openssh
}


resource "aws_security_group" "ssh" {
  ingress {
    protocol = "TCP"
    from_port = 22
    to_port = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    protocol = "-1"
    from_port = 0
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_instance" "builder_instance" {
  ami           = "ami-0f9c27b471bdcd702" # Debian 13 (HVM), SSD Volume Type, 64-bit
  instance_type = "t3.micro"
  key_name      = aws_key_pair.agent_keypair.key_name
  vpc_security_group_ids = [aws_security_group.ssh.id]
  subnet_id = "subnet-09dedc6d9d360ae74"

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io openjdk-21-jre
    usermod -aG docker admin
    mkdir -p /home/admin/jenkins
    cd /home/admin/jenkins
    curl -O http://[$JENKINS_IP]:8080/jnlpJars/agent.jar
    chown -R admin:admin /home/admin/jenkins
    su - admin -c "java -jar /home/admin/jenkins/agent.jar \
      -url http://[$JENKINS_IP]:8080 \
      -secret $AGENT_SECRET \
      -name remote-builder \
      -webSocket \
      -workDir /home/admin/jenkins &"
  EOF
}

output "public_ip" {
  value = aws_instance.builder_instance.public_ip
}

output "private_key_pem" {
  value = tls_private_key.agent_key.private_key_pem
  sensitive = true
}

resource "local_file" "agent_private_key" {
  content = tls_private_key.agent_key.private_key_pem
  filename = "${path.module}/builder.pem"
  file_permission = "0600"
}