# Docker plugin for Tabby Terminal

## Introduction
This plugin lets you shell right into running Docker containers and start new ones.

You can connect to a running container through the profile selector, or create a new profile from the `Docker container shell` profile template and then select an image and/or custom shell command.

## Prerequisites
1) Install Docker on your machine
2) pull a required Docker Image using https://hub.docker.com/
3) Make sure docker service is up:
  - In MAC - `sudo launchctl list | grep docker`
  - In Linux - `systemctl show --property ActiveState docker`

## Setup Steps
1) Go to Tabby => Setting => "Plugins" - and search for "docker" under the "Available" plugins section, and install the plugin if not installed.
2) Go to Tabby => Setting => "Profiles" => "Profiles" tab, and select "New Profile"
3) Give the profile a name and in "Image" field click the "Select" button
4) Choose the previosly pulled image (from step #1) and click "Save".
5) The profile should be available in profiles now.

![](screenshot1.png)
![](screenshot2.png)
