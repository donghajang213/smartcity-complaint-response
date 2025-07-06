@echo off
REM create_branches.bat - Windows CMD branch creation script

SET MAIN_BRANCH=main

echo Checking out %MAIN_BRANCH% branch
git checkout %MAIN_BRANCH%
git pull origin %MAIN_BRANCH%

SET BRANCHES=dev feature/backend/dongha feature/backend/guil feature/backend/suna feature/frontend/dongha feature/frontend/guil feature/frontend/suna feature/ai/dongha feature/ai/guil feature/ai/suna

FOR %%b IN (%BRANCHES%) DO (
    echo Creating branch %%b
    git checkout %MAIN_BRANCH%
    git branch -D %%b 2>nul
    git branch %%b
    git push -u origin %%b
)

echo Returning to %MAIN_BRANCH% branch
git checkout %MAIN_BRANCH%

echo All branches created and pushed.
echo Current local branches:
git branch