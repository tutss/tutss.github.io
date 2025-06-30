---
layout: post
title: "Building a Zotero MCP Server for research management"
date:   2025-06-29 13:46:33 -0300
categories: [python, research, mcp, zotero]
tags: [data-science, automation, api]
---


--- 

**Edit #1**: It is important to emphasize that to use this MCP server on Claude Desktop you must go into:
- Claude > Settings > Developer > Edit config
- On `claude_desktop_config.json`, add the following on `mcpServers`: 

```json
"zotero": {
      "command": "python3", 
      "args": [
        "/Users/arturmagalhaes/Documents/repos/datascience/agents/zotero_mcp_server.py"
      ],
      "env": {
        "ZOTERO_API_KEY": "your_api_key_here",
        "ZOTERO_USER_ID": "your_user_id_here",
        "ZOTERO_LIBRARY_TYPE": "user"
      }
    }
```

Be sure to set the appropriate path and command - it may be just `python`. For me, I set the path directly poiting to my repository.


---

As a data scientist working on my Master's thesis, I needed a way to programmatically interact with my Zotero research library. This guide shows how to build a Model Context Protocol (MCP) server for Zotero integration.

I wanted to try this vibe coding thing for a while, to check the current tools out there. For this one, I am using `Claude Sonnet 4` on the Pro plan. So far it has been a great experience. Claude provides great suggestions and given it has a easy way to connect to MCP servers, I decided to go for it.

Here's what you might do with it:

|![mcp-example-1](/files/images/zotero-server-ex1.png)|
|:--:| 
|Example 1: Checking latest item on my library|

|![mcp-example-2](/files/images/zotero-server-ex2.png)|
|:--:| 
|Example 2: Face recognition surveys on my library|


Now let's head to the MCP server.

### What is MCP?

Model Context Protocol (MCP) is a protocol that enables AI assistants to connect to external data sources and tools. It provides a unified interface for models to access databases, APIs, file systems, and other resources through **servers** that expose **resources** (data sources like files or databases) and **tools** (functions like search or data manipulation).

MCP consists of 3 main building blocks: **Host** (LLM application/model), **Servers** (lightweight program that exposes capabilities), **Clients** (AI assistants that consume server capabilities, 1:1 connection with server). This architecture allows AI assistants to extend their capabilities beyond their training data by connecting to live, external systems in a standardized way.

**Server** is responsible for the tools and how to handle them, while the **Client** can access and use them. Here, I am using Claude Desktop to access my MCP server, but you could add it into your LLM workflow.

**The code for this server can be found on: [Github repo](https://github.com/tutss/datascience/blob/master/agents/zotero_mcp_server.py)**


|![mcp-example](/files/images/mcp-example.png)|
|:--:| 
|Taken from *MCP: Build Rich-Context AI Apps with Anthropic* DeepLearning.ai course|

## Prerequisites

Install `mcp` and `httpx`:

```bash
pip install mcp httpx
```

## Getting Zotero API Credentials

> You must have an Zotero account.

1. Go to [https://www.zotero.org/settings/keys](https://www.zotero.org/settings/keys)
2. Create a new API key with:
   - ✓ Allow library access
   - ✓ Allow write access (optional)
3. Note your User ID (shown on the same page, it is a number not your username)

## Environment Setup

Create a `.env` file with the following env variables:

```
ZOTERO_API_KEY=your_api_key_here
ZOTERO_USER_ID=your_user_id_here
ZOTERO_LIBRARY_TYPE="user"
```

## Implementation

Here's what we can do with this server:

**Tools**

- **test_connection** - Verify Zotero API access
- **search_items** - Search your library by query
- **get_collections** - List all collections
- **get_item_details** - Get full item information by key

**Resources**

- **zotero://collections** - All collections
- **zotero://items** - All library items  
- **zotero://recent** - Recently added items

### What you can do with it

#### Organize by thesis chapters:
```python
# Get collections for different thesis sections
await call_tool("get_collections")
```

#### Search for relevant papers:
```python
# Find machine learning papers
await call_tool("search_items", {"query": "machine learning", "limit": 20})
```

#### Get detailed paper information:
```python
# Get full details of a specific paper
await call_tool("get_item_details", {"item_key": "ABC123DEF"})
```

### Essential components

Think of an MCP server like a library system. When you walk into a library, you need three things:

1. **A catalog** (what books are available) → `@self.server.list_resources()`
2. **The ability to get a book** (actually retrieve content) → `@self.server.read_resource()`  
3. **A services menu** (what can you do - print, search, etc.) → `@self.server.list_tools()`

#### 1. `@self.server.list_resources()` - The "Menu"
This tells the LLM: *"Here's what data I have available"*

```python
# Returns a catalog like:
[
  "zotero://collections - Your research collections",
  "zotero://items - All your papers", 
  "zotero://recent - Recently added papers"
]
```

**Why needed**: The LLM can't guess what data you have. This is like showing a restaurant menu before ordering.

#### 2. `@self.server.read_resource()` - The "Getter"  
This actually retrieves the data when the LLM asks for it.

```python
# LLM says: "Give me zotero://recent"
# Server responds with: [list of recent papers]
```

**Why needed**: Listing resources is just advertising. This actually delivers the goods.

#### 3. `@self.server.list_tools()` - The "Action Menu"
This tells the LLM: *"Here's what actions I can perform"*

```python
# Returns capabilities like:
[
  "search_items - Find papers by query",
  ...
]
```

**Why needed**: The LLM needs to know what it can DO, not just what data it can READ.

Here's the typical conversation flow:

```
🤖 LLM: "What resources do you have?"
📚 Server: list_resources() → "I have collections, items, recent papers"

🤖 LLM: "Show me recent papers" 
📚 Server: read_resource("zotero://recent") → [actual paper data]

🤖 LLM: "What tools can you run?"
📚 Server: list_tools() → "I can search, get details, test connection"

🤖 LLM: "Search for 'machine learning' papers"
📚 Server: call_tool("search_items", {"query": "machine learning"}) → [search results]
```

### Flow diagram (thanks Claude!)

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│      LLM        │         │   MCP Server    │
│   (Claude)      │         │   (Zotero)      │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
         │                           │
         │                           │
    ┌────▼────┐                 ┌────▼────┐
    │ 1. "What│                 │ list_   │
    │ data do │────────────────▶│resources│
    │ you have│                 │ ()      │
    │ ?"      │                 └────┬────┘
    └─────────┘                      │
         ▲                           │
         │                           ▼
    ┌────┴────┐                 ┌────────┐
    │ Menu of │◀────────────────│["recent│
    │available│                 │ items",│
    │resources│                 │"collec │
    └─────────┘                 │tions"] │
         │                      └────────┘
         │
    ┌────▼────┐                 ┌────────┐
    │ 2. "Give│                 │ read_  │
    │ me recent────────────────▶│resource│
    │ items"  │                 │ ()     │
    └─────────┘                 └────┬───┘
         ▲                           │
         │                           ▼
    ┌────┴────┐                 ┌────────┐
    │ Actual  │◀────────────────│[Paper1,│
    │ paper   │                 │ Paper2,│
    │ data    │                 │ ...]   │
    └─────────┘                 └────────┘
         │
         │
    ┌────▼────┐                 ┌────────┐
    │ 3. "What│                 │ list_  │
    │ actions │────────────────▶│ tools  │
    │ can you │                 │ ()     │
    │ do?"    │                 └────┬───┘
    └─────────┘                      │
         ▲                           ▼
         │                      ┌────────┐
    ┌────┴────┐                 │["search│
    │ Tool    │◀────────────────│_items",│
    │ menu    │                 │"get_   │
    └─────────┘                 │details"]│
         │                      └────────┘
         │
    ┌────▼────┐                 ┌────────┐
    │ 4. "Run │                 │ call_  │
    │ search  │────────────────▶│ tool   │
    │ for ML" │                 │ ()     │
    └─────────┘                 └────┬───┘
         ▲                           │
         │                           ▼
    ┌────┴────┐                 ┌────────┐
    │ Search  │◀────────────────│[ML     │
    │ results │                 │ papers]│
    └─────────┘                 └────────┘
```

This separation allows the LLM to both **consume your existing data** and **actively interact** with your Zotero library to perform new searches, get details, or modify content.

MCP protocol ensures the LLM always knows what's available before asking for it - no guessing, no errors, just smooth data access and tool execution.


#### List resources

```python
@self.server.list_resources()
async def handle_list_resources() -> List[Resource]:
    """List available Zotero resources"""
    try:
        logger.debug("Listing resources")
        return [
            Resource(
                uri="zotero://collections",
                name="Zotero Collections",
                description="List all collections in your Zotero library",
                mimeType="application/json",
            ),
            Resource(
                uri="zotero://items",
                name="Zotero Items", 
                description="All items in your Zotero library",
                mimeType="application/json",
            ),
            Resource(
                uri="zotero://recent",
                name="Recent Items",
                description="Recently added items",
                mimeType="application/json",
            ),
        ]
    except Exception as e:
        logger.error(f"Error listing resources: {e}")
        raise
```

#### Read resource

```python
@self.server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """Read a specific Zotero resource"""
    try:
        logger.debug(f"Reading resource: {uri}")
        
        if uri == "zotero://collections":
            collections = await self._get_collections()
            return json.dumps(collections, indent=2)
        elif uri == "zotero://items":
            items = await self._get_items(limit=50)
            return json.dumps(items, indent=2)
        elif uri == "zotero://recent":
            items = await self._get_items(limit=10, sort="dateAdded", direction="desc")
            return json.dumps(items, indent=2)
        else:
            raise ValueError(f"Unknown resource URI: {uri}")
            
    except Exception as e:
        logger.error(f"Error reading resource {uri}: {e}")
        return json.dumps({"error": str(e)}, indent=2)
```

#### List tools

```python
@self.server.list_tools()
async def handle_list_tools() -> List[Tool]:
    """List available tools"""
    try:
        logger.debug("Listing tools")
        return [
            Tool(
                name="test_connection",
                description="Test connection to Zotero API",
                inputSchema={
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            ),
            Tool(
                name="search_items",
                description="Search items in Zotero library",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Search query"
                        },
                        "limit": {
                            "type": "integer",
                            "description": "Maximum number of results",
                            "default": 10
                        }
                    },
                    "required": ["query"]
                }
            ),
            Tool(
                name="get_collections",
                description="Get all collections in the library",
                inputSchema={
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            ),
            Tool(
                name="get_item_details",
                description="Get detailed information about a specific item",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "item_key": {
                            "type": "string",
                            "description": "Zotero item key"
                        }
                    },
                    "required": ["item_key"]
                }
            )
        ]
    except Exception as e:
        logger.error(f"Error listing tools: {e}")
        raise
```

#### Call tools

```python
@self.server.call_tool()
async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    """Handle tool calls"""
    try:
        logger.debug(f"Calling tool: {name} with args: {arguments}")
        
        if name == "test_connection":
            result = await self._test_connection_tool()
        elif name == "search_items":
            result = await self._search_items(**arguments)
        elif name == "get_collections":
            result = await self._get_collections()
        elif name == "get_item_details":
            result = await self._get_item_details(arguments["item_key"])
        else:
            raise ValueError(f"Unknown tool: {name}")
        
        return [TextContent(type="text", text=json.dumps(result, indent=2))]
    
    except Exception as e:
        logger.error(f"Error calling tool {name}: {e}")
        logger.error(traceback.format_exc())
        return [TextContent(type="text", text=f"Error: {str(e)}")]
```


Given our definitions of how to use resources and tools, here's the full code:

#### Full code

```python
#!/usr/bin/env python3
"""
Zotero MCP Server - Final Working Version for MCP 1.10.1
A Model Context Protocol server for interacting with Zotero libraries.
"""

import asyncio
from dotenv import load_dotenv
import json
import logging
import sys
import traceback
from typing import Any, Dict, List, Optional
from urllib.parse import quote

# Check if required packages are installed
try:
    import httpx
    from mcp.server import Server
    from mcp.server.models import InitializationOptions
    from mcp.types import Resource, Tool, TextContent
    from mcp.server.stdio import stdio_server
except ImportError as e:
    print(f"Missing required package: {e}")
    print("Please install with: pip install mcp httpx")
    sys.exit(1)

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("zotero-mcp-server")

load_dotenv()

class ZoteroMCPServer:
    def __init__(self, api_key: str, user_id: str, library_type: str = "user"):
        """Initialize Zotero MCP Server with error checking"""
        if not api_key:
            raise ValueError("ZOTERO_API_KEY is required")
        if not user_id:
            raise ValueError("ZOTERO_USER_ID is required")
        
        self.api_key = api_key
        self.user_id = user_id
        self.library_type = library_type
        self.base_url = f"https://api.zotero.org/{library_type}s/{user_id}"
        
        logger.info(f"Initializing Zotero MCP Server")
        logger.info(f"Base URL: {self.base_url}")
        logger.info(f"API Key: {'*' * (len(api_key) - 4) + api_key[-4:]}")
        
        self.server = Server("zotero-mcp-server")
        self.client = None
        
        # Register handlers
        self._register_handlers()
    
    async def _test_connection(self):
        """Test Zotero API connection"""
        try:
            if not self.client:
                self.client = httpx.AsyncClient(timeout=30.0)
            
            headers = {"Zotero-API-Key": self.api_key}
            response = await self.client.get(f"{self.base_url}/collections?limit=1", headers=headers)
            
            if response.status_code == 200:
                logger.info("✓ Zotero API connection successful")
                return True
            elif response.status_code == 403:
                logger.error("✗ Zotero API authentication failed - check your API key")
                return False
            else:
                logger.warning(f"Zotero API returned status {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"✗ Failed to connect to Zotero API: {e}")
            return False
    
    def _register_handlers(self):
        """Register MCP handlers with error handling"""
        
        @self.server.list_resources()
        async def handle_list_resources() -> List[Resource]:
            """List available Zotero resources"""
            try:
                logger.debug("Listing resources")
                return [
                    Resource(
                        uri="zotero://collections",
                        name="Zotero Collections",
                        description="List all collections in your Zotero library",
                        mimeType="application/json",
                    ),
                    Resource(
                        uri="zotero://items",
                        name="Zotero Items", 
                        description="All items in your Zotero library",
                        mimeType="application/json",
                    ),
                    Resource(
                        uri="zotero://recent",
                        name="Recent Items",
                        description="Recently added items",
                        mimeType="application/json",
                    ),
                ]
            except Exception as e:
                logger.error(f"Error listing resources: {e}")
                raise
        
        @self.server.read_resource()
        async def handle_read_resource(uri: str) -> str:
            """Read a specific Zotero resource"""
            try:
                logger.debug(f"Reading resource: {uri}")
                
                if uri == "zotero://collections":
                    collections = await self._get_collections()
                    return json.dumps(collections, indent=2)
                elif uri == "zotero://items":
                    items = await self._get_items(limit=50)
                    return json.dumps(items, indent=2)
                elif uri == "zotero://recent":
                    items = await self._get_items(limit=10, sort="dateAdded", direction="desc")
                    return json.dumps(items, indent=2)
                else:
                    raise ValueError(f"Unknown resource URI: {uri}")
                    
            except Exception as e:
                logger.error(f"Error reading resource {uri}: {e}")
                return json.dumps({"error": str(e)}, indent=2)
        
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            """List available tools"""
            try:
                logger.debug("Listing tools")
                return [
                    Tool(
                        name="test_connection",
                        description="Test connection to Zotero API",
                        inputSchema={
                            "type": "object",
                            "properties": {},
                            "required": []
                        }
                    ),
                    Tool(
                        name="search_items",
                        description="Search items in Zotero library",
                        inputSchema={
                            "type": "object",
                            "properties": {
                                "query": {
                                    "type": "string",
                                    "description": "Search query"
                                },
                                "limit": {
                                    "type": "integer",
                                    "description": "Maximum number of results",
                                    "default": 10
                                }
                            },
                            "required": ["query"]
                        }
                    ),
                    Tool(
                        name="get_collections",
                        description="Get all collections in the library",
                        inputSchema={
                            "type": "object",
                            "properties": {},
                            "required": []
                        }
                    ),
                    Tool(
                        name="get_item_details",
                        description="Get detailed information about a specific item",
                        inputSchema={
                            "type": "object",
                            "properties": {
                                "item_key": {
                                    "type": "string",
                                    "description": "Zotero item key"
                                }
                            },
                            "required": ["item_key"]
                        }
                    )
                ]
            except Exception as e:
                logger.error(f"Error listing tools: {e}")
                raise
        
        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            """Handle tool calls"""
            try:
                logger.debug(f"Calling tool: {name} with args: {arguments}")
                
                if name == "test_connection":
                    result = await self._test_connection_tool()
                elif name == "search_items":
                    result = await self._search_items(**arguments)
                elif name == "get_collections":
                    result = await self._get_collections()
                elif name == "get_item_details":
                    result = await self._get_item_details(arguments["item_key"])
                else:
                    raise ValueError(f"Unknown tool: {name}")
                
                return [TextContent(type="text", text=json.dumps(result, indent=2))]
            
            except Exception as e:
                logger.error(f"Error calling tool {name}: {e}")
                logger.error(traceback.format_exc())
                return [TextContent(type="text", text=f"Error: {str(e)}")]
    
    async def _ensure_client(self):
        """Ensure HTTP client is initialized"""
        if not self.client:
            self.client = httpx.AsyncClient(timeout=30.0)
    
    async def _make_request(self, endpoint: str, method: str = "GET", data: Optional[Dict] = None) -> Dict:
        """Make authenticated request to Zotero API"""
        await self._ensure_client()
        
        url = f"{self.base_url}/{endpoint}"
        headers = {
            "Zotero-API-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        logger.debug(f"Making {method} request to: {url}")
        
        try:
            if method == "GET":
                response = await self.client.get(url, headers=headers)
            elif method == "POST":
                response = await self.client.post(url, headers=headers, json=data)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            logger.debug(f"Response status: {response.status_code}")
            
            if response.status_code == 403:
                raise Exception("Authentication failed - check your API key and permissions")
            elif response.status_code == 404:
                raise Exception("Resource not found - check your user ID and library type")
            
            response.raise_for_status()
            return response.json()
            
        except httpx.RequestError as e:
            logger.error(f"Request error: {e}")
            raise Exception(f"Network error: {e}")
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e}")
            raise Exception(f"HTTP error {e.response.status_code}: {e.response.text}")
    
    async def _test_connection_tool(self) -> Dict:
        """Test connection tool"""
        try:
            collections = await self._make_request("collections?limit=1")
            return {
                "status": "success",
                "message": "Successfully connected to Zotero API",
                "collections_found": len(collections)
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    async def _get_collections(self) -> List[Dict]:
        """Get all collections"""
        return await self._make_request("collections")
    
    async def _get_items(self, limit: int = 25, sort: str = "title", direction: str = "asc") -> List[Dict]:
        """Get items from library"""
        endpoint = f"items?limit={limit}&sort={sort}&direction={direction}"
        return await self._make_request(endpoint)
    
    async def _search_items(self, query: str, limit: int = 10) -> List[Dict]:
        """Search items in library"""
        endpoint = f"items?q={quote(query)}&limit={limit}"
        return await self._make_request(endpoint)
    
    async def _get_item_details(self, item_key: str) -> Dict:
        """Get detailed information about a specific item"""
        return await self._make_request(f"items/{item_key}")
    
    async def run(self):
        """Run the MCP server"""
        try:
            logger.info("Starting Zotero MCP Server...")
            
            # Initialize HTTP client and test connection
            await self._ensure_client()
            connection_ok = await self._test_connection()
            
            if not connection_ok:
                logger.error("Failed to connect to Zotero API. Server will start but may not work properly.")
            
            logger.info("Server is ready to accept connections")
            
            # Use stdio server for MCP 1.10.1
            async with stdio_server() as (read_stream, write_stream):
                await self.server.run(
                    read_stream, 
                    write_stream, 
                    InitializationOptions(
                        server_name="zotero-mcp-server",
                        server_version="1.0.0",
                        capabilities={}
                    )
                )
            
        except Exception as e:
            logger.error(f"Server failed to start: {e}")
            logger.error(traceback.format_exc())
            raise
        finally:
            if self.client:
                await self.client.aclose()


def main():
    """Main entry point with comprehensive error checking"""
    import os
    
    try:
        # Check environment variables
        api_key = os.getenv("ZOTERO_API_KEY")
        user_id = os.getenv("ZOTERO_USER_ID") 
        library_type = os.getenv("ZOTERO_LIBRARY_TYPE", "user")
        
        logger.info("=== Zotero MCP Server Debug Info ===")
        logger.info(f"Python version: {sys.version}")
        logger.info(f"API Key present: {'Yes' if api_key else 'No'}")
        logger.info(f"User ID present: {'Yes' if user_id else 'No'}")
        logger.info(f"Library type: {library_type}")
        
        if not api_key:
            logger.error("❌ ZOTERO_API_KEY environment variable is missing")
            print("\nTo get your API key:")
            print("1. Go to https://www.zotero.org/settings/keys")
            print("2. Create a new API key")
            print("3. Set the environment variable: export ZOTERO_API_KEY='your_key'")
            return 1
            
        if not user_id:
            logger.error("❌ ZOTERO_USER_ID environment variable is missing")
            print("\nTo get your User ID:")
            print("1. Go to https://www.zotero.org/settings/keys")
            print("2. Your User ID is shown on that page")
            print("3. Set the environment variable: export ZOTERO_USER_ID='your_id'")
            return 1
        
        # Create and run server
        server = ZoteroMCPServer(api_key, user_id, library_type)
        asyncio.run(server.run())
        
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
        return 0
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        logger.error(traceback.format_exc())
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
```

## Troubleshooting

**Common Issues:**
- **403 Error**: Check API key permissions
- **404 Error**: Verify User ID and library type
- **Import Error**: Install missing packages with `pip install mcp httpx`

The server I am using is MCP 1.10.1 with `stdio_server()` for communication streams. This pattern is required for proper JSON-RPC communication between the MCP client and server.

---

This MCP server provides programmatic access to your Zotero library, making research management more efficient for data science projects and academic work.
