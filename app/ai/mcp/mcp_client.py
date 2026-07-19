import os
from contextlib import asynccontextmanager
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from app.config.settings import settings

class GitHubMCPClient:
    """
    Client wrapper for official GitHub MCP Server.
    Manages stdio connection and RPC calls.
    """

    def __init__(self):
        # We read the GITHUB_PERSONAL_ACCESS_TOKEN from env settings.
        self.token = settings.github_personal_access_token or ""
        
        # Configure standard parameters to execute the npm package on the fly
        self.server_parameters = StdioServerParameters(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-github"],
            env={
                **os.environ,
                "GITHUB_PERSONAL_ACCESS_TOKEN": self.token,
            }
        )

    @asynccontextmanager
    async def get_session(self):
        """
        Asynchronous context manager to start stdio connection and return session.
        """
        async with stdio_client(self.server_parameters) as (read_stream, write_stream):
            async with ClientSession(read_stream, write_stream) as session:
                await session.initialize()
                yield session

    async def list_tools(self):
        """
        Helper method to list all available tools on the GitHub MCP server.
        """
        async with self.get_session() as session:
            response = await session.list_tools()
            return response.tools

    async def call_tool(self, tool_name: str, arguments: dict):
        """
        Invoke a specific tool exposed by the GitHub MCP server.
        """
        async with self.get_session() as session:
            result = await session.call_tool(tool_name, arguments=arguments)
            return result.content
