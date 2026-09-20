/** @type {import('next').NextConfig} */
/**
const nextConfig = {};

module.exports = nextConfig;
**/

// The system's default DNS resolver fails to resolve some hostnames
// (e.g. integrate.api.nvidia.com) even though the domain is valid and
// resolves fine via Google's DNS. This forces Node's own resolver to
// use Google's DNS servers instead, without touching OS network settings.
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;