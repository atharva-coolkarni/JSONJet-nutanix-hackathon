from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import StreamingResponse
from backend.app.schemas.workflow_schema import Workflow
from backend.app.utils.logger import log, log_queue
from backend.app.engine.executor import execute_shell, execute_rest
import json, asyncio

router = APIRouter()

@router.post("/run-workflow")
async def run_workflow(file: UploadFile = File(...)):
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Please upload a JSON file")

    # Reads the file content asynchronously
    content = await file.read()
    try:
        data = json.loads(content)
        workflow = Workflow(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")

    # Iterates through each step in the workflow, logs its details.
    log(f"Starting workflow: {workflow.workflow_name}")
    for step in workflow.steps:
        log(f"Step: {step.id} | Type: {step.type}")
        try:
            if step.type == "shell" and step.command:
                await execute_shell(step.command)
            elif step.type == "rest" and step.url:
                await execute_rest(step.method, step.url, step.headers, step.payload)
            else:
                log(f"Invalid step: {step.id}")
        except Exception as e:
            log(f"Error in step {step.id}: {str(e)}")
    log(f"Workflow '{workflow.workflow_name}' completed")
    return {"status": "success", "workflow": workflow.workflow_name}

@router.get("/stream-logs")
async def stream_logs(request: Request):
    async def event_generator():
        while True:
            if await request.is_disconnected():
                break
            try:
                msg = await asyncio.wait_for(log_queue.get(), timeout=1.0)
                yield f"data: {msg}\n\n"
            except asyncio.TimeoutError:
                continue
    return StreamingResponse(event_generator(), media_type="text/event-stream")
