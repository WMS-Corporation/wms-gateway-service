@echo off

setlocal
set "workspace=C:\Users\Michele Studio\source\repos\PSE-Project\WCs"

for /d %%d in ("%workspace%\*") do (
    cd "%%d"
    echo Avvio Node.js in %%d
    start cmd /c "node index.js"
)


endlocal
