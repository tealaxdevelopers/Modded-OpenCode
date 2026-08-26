@echo off
chcp 65001 >nul
title OpenCode Setup Wizard
mode con: cols=78 lines=42
color 0B
setlocal

echo.
echo  ============================================
echo    OpenCode Setup Wizard
echo    ~ Fully automated configuration ~
echo  ============================================
echo.

:ask_lang
set "lang="
set /p "lang=  Dil / Language / Yazyk (tr / us / ru): "
if /i "%lang%"=="tr" (call :lang_tr & goto lang_ok)
if /i "%lang%"=="us" (call :lang_us & goto lang_ok)
if /i "%lang%"=="ru" (call :lang_ru & goto lang_ok)
echo  ** type tr, us or ru **
goto ask_lang

:lang_ok
echo.
set "default_username=%USERNAME%"
set /p "username=  %L_USER_ASK% (ENTER = %default_username%): "
if "%username%"=="" set "username=%default_username%"

set "addressing=%L_ADDR_DEF%"
set /p "addressing=  %L_ADDR_ASK% (ENTER = %addressing%): "

echo.
echo  %L_GH_INFO%

:ask_ghkey
set "ghkey="
set /p "ghkey=  %L_GH_ASK%: "
if "%ghkey%"=="" (
  echo  %L_GH_SKIP%
  goto ask_bravekey
)
set "gh_n=0"
set "ghrest=%ghkey%"

:gh_split
set "tok="
for /f "tokens=1* delims=," %%A in ("%ghrest%") do (
  set "tok=%%A"
  set "ghrest=%%B"
)
if "%tok%"=="" goto gh_finish
for /f "tokens=* delims= " %%X in ("%tok%") do set "tok=%%X"
if "%tok%"=="" goto gh_split
call :check_chars tok
if errorlevel 1 (
  echo  %L_BAD_CHARS%
  set "ghkey="
  goto ask_ghkey
)
set /a gh_n+=1
setx GITHUB_API_KEY_%gh_n% "%tok%" >nul
goto gh_split

:gh_finish
if "%gh_n%"=="0" (
  echo  %L_GH_SKIP%
  goto ask_bravekey
)
set "HAS_GITHUB=1"
if "%gh_n%"=="1" (
  setx GITHUB_API_KEY "%tok%" >nul
) else (
  set "HAS_GITHUB_MULTI=1"
  set "OC_GH_FIRST=%tok%"
  setx GITHUB_TOKEN_COUNT "%gh_n%" >nul
)
echo  %L_GH_SET1% %gh_n%%L_GH_SET2%
goto ask_bravekey

:ask_bravekey
echo.
echo  %L_BRAVE_INFO%
set "bravekey="
set /p "bravekey=  %L_BRAVE_ASK%: "
if "%bravekey%"=="" (
  echo  %L_BRAVE_SKIP%
  goto ask_extra
)
call :check_chars bravekey
if errorlevel 1 (
  echo  %L_BAD_CHARS%
  goto ask_bravekey
)
setx BRAVE_API_KEY "%bravekey%" >nul
set "HAS_BRAVE=1"
echo  %L_BRAVE_SET%

:ask_extra
echo.
echo  ----------------------------------------
echo  %L_EXTRA_HEAD%
echo  %L_EXTRA_OPT1%
echo  %L_EXTRA_OPT2%
echo  %L_EXTRA_OPT3%
echo  %L_EXTRA_OPT4%
echo  ----------------------------------------
set "extra="
set /p "extra=  %L_EXTRA_ASK%: "
if "%extra%"=="1" goto custom_provider
goto install_start

:custom_provider
echo.
set /p "cbase=  %L_CBASE%: "
if "%cbase%"=="" (echo  %L_C_CANCEL% & goto ask_extra)
set /p "cmodel=  %L_CMODEL%: "
if "%cmodel%"=="" (echo  %L_C_CANCEL% & goto ask_extra)
set /p "ckey=  %L_CKEY%: "
if "%ckey%"=="" (echo  %L_C_CANCEL% & goto ask_extra)
call :check_chars cbase
if errorlevel 1 (echo  %L_BAD_CHARS% & goto custom_provider)
call :check_chars cmodel
if errorlevel 1 (echo  %L_BAD_CHARS% & goto custom_provider)
call :check_chars ckey
if errorlevel 1 (echo  %L_BAD_CHARS% & goto custom_provider)
setx CUSTOM_LLM_API_KEY "%ckey%" >nul
set "HAS_CUSTOM=1"
echo  %L_C_DONE%
goto install_start

:install_start
set "target_dir=C:\Users\%username%\.config\opencode"
set "source_dir=%~dp0source"
set "OC_USERNAME=%username%"
set "OC_ADDRESSING=%addressing%"
set "OC_LANGUAGE=%L_LANG_WORD%"
set "OC_TARGET=%target_dir%"
set "OC_SOURCE=%source_dir%"

echo.
echo  ============================================
echo  %L_SUM_HEAD%
echo    %L_USER%:    %username%
echo    %L_ADDR%:   %addressing%
echo    %L_LANG%:    %L_LANG_WORD%
echo    %L_TARG%:  %target_dir%
echo  ============================================
echo.

echo  [1/7] %L_S1%
if not exist "%target_dir%" mkdir "%target_dir%" 2>nul
for %%D in (skills agents commands instructions plugins agent) do (
  if not exist "%target_dir%\%%D" mkdir "%target_dir%\%%D" 2>nul
)
echo         OK

echo  [2/7] %L_S2%
xcopy "%source_dir%\skills\*" "%target_dir%\skills\" /E /I /Y /Q >nul 2>nul
echo         OK

echo  [3/7] %L_S3%
xcopy "%source_dir%\agents\*" "%target_dir%\agents\" /E /I /Y /Q >nul 2>nul
xcopy "%source_dir%\commands\*" "%target_dir%\commands\" /E /I /Y /Q >nul 2>nul
xcopy "%source_dir%\instructions\*" "%target_dir%\instructions\" /E /I /Y /Q >nul 2>nul
xcopy "%source_dir%\plugins\*" "%target_dir%\plugins\" /E /I /Y /Q >nul 2>nul
echo         OK

echo  [4/7] %L_S4% (%addressing%, %L_LANG_WORD%)
powershell -NoProfile -Command "$c=(Get-Content \"$env:OC_SOURCE\rules.md\" -Raw); $c=$c -replace '{{LANGUAGE}}', $env:OC_LANGUAGE; $c=$c -replace '{{ADDR_UPPER}}', $env:OC_ADDRESSING; $c=$c -replace '{{ADDR_AI}}', ('T3' + $env:OC_ADDRESSING + '-ai'); $c=$c -replace '{{HITAP}}', $env:OC_ADDRESSING; Set-Content (Join-Path $env:OC_TARGET 'rules.md') -Value $c"
if errorlevel 1 (echo         ERROR! & pause & exit /b 1)
echo         OK

echo  [5/7] %L_S5% (%username%)
if "%HAS_CUSTOM%"=="1" (
  set "OC_CBASE=%cbase%"
  set "OC_CMODEL=%cmodel%"
  set "OC_CKEY=%ckey%"
)
if "%HAS_GITHUB_MULTI%"=="1" set "OC_GH_MULTI=1"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build-config.ps1"
if errorlevel 1 (echo         ERROR! & pause & exit /b 1)
echo         OK

echo  [6/7] %L_S6%
if exist "%source_dir%\.agents-opencode-manifest.json" (
  powershell -NoProfile -Command "$c=(Get-Content \"$env:OC_SOURCE\.agents-opencode-manifest.json\" -Raw); $c=$c -replace '{{USERNAME}}', $env:OC_USERNAME; Set-Content (Join-Path $env:OC_TARGET '.agents-opencode-manifest.json') -Value $c" 2>nul
)
echo         OK

echo  [7/7] %L_S7%
if exist "%target_dir%\skills\research\SKILL.md" (
  powershell -NoProfile -Command "$p=Join-Path $env:OC_TARGET 'skills\research\SKILL.md'; $c=(Get-Content $p -Raw); $c=$c -replace '{{HITAP}}', $env:OC_ADDRESSING; Set-Content $p -Value $c" 2>nul
)
echo         OK

echo.
echo  ============================================
echo  %L_DONE_HEAD%
echo    %L_USER%:    %username%
echo    %L_ADDR%:   %addressing%
echo    %L_LANG%:    %L_LANG_WORD%
if "%HAS_GITHUB%"=="1" (echo    GitHub API key: OK) else (echo    %L_DONE_NOGH%)
if "%HAS_BRAVE%"=="1" (echo    Brave API key:  OK) else (echo    %L_DONE_NOBRAVE%)
if "%HAS_CUSTOM%"=="1" (echo    Custom provider: OK) else (echo    %L_DONE_NOCUST%)
echo  ============================================
echo.
echo  %L_RUN_HINT1%
echo    start.cmd
echo  %L_RUN_HINT2%
echo    opencode
echo.
pause
exit /b 0

:check_chars
call set "CHK_VAL=%%%~1%%"
powershell -NoProfile -Command "if ($env:CHK_VAL -match '[&|^<>!]') { exit 1 } else { exit 0 }"
exit /b %errorlevel%

:lang_tr
set "L_LANG_WORD=Turkce"
set "L_USER_ASK=Kullanici adin ne?"
set "L_ADDR_ASK=Sana nasil hitap edilsin?"
set "L_ADDR_DEF=Tealax"
set "L_LANG=Dil"
set "L_GH_INFO=Birincil: GitHub API key. Bos birakirsan GitHub MCP kapali kurulur."
set "L_GH_ASK=GitHub API key'ler - birden fazla ise virgulle ayir (ENTER = atla)"
set "L_GH_SKIP=[i] Atlandi. Sonra eklemek icin: setx GITHUB_API_KEY ..."
set "L_GH_SET1=[+] "
set "L_GH_SET2= GitHub anahtari kaydedildi (GITHUB_API_KEY_1..N). Dosyaya yazilmadi."
set "L_BRAVE_INFO=Ikincil: Brave Search API key. Varsa web aramasi acilir."
set "L_BRAVE_ASK=Brave API key (ENTER = atla)"
set "L_BRAVE_SKIP=[i] Atlandi. Brave web aramasi kapali kuruldu."
set "L_BRAVE_SET=[+] BRAVE_API_KEY kaydedildi, brave-search MCP aktif olacak."
set "L_BAD_CHARS=[!] Gecersiz karakter algilandi, tekrar gir."
set "L_EXTRA_HEAD=Baska entegrasyon var mi? Secenekler:"
set "L_EXTRA_OPT1=  [1] OpenAI-uyumlu ozel provider ekle (baseURL + model + key)"
set "L_EXTRA_OPT2=  [2] Hazir saglayicilar (OpenAI, Anthropic, Google...) icin:"
set "L_EXTRA_OPT3=      kurulumdan sonra 'opencode auth login' komutunu kullan"
set "L_EXTRA_OPT4=  Kurulumla hazir provider GELMEZ. Detay: README"
set "L_EXTRA_ASK=Secim numarasi (ENTER = hayir, gec)"
set "L_CBASE=Base URL (orn. https://api.ornek.com/v1)"
set "L_CMODEL=Model adi (orn. qwen-turbo-latest)"
set "L_CKEY=API key"
set "L_C_CANCEL=[i] Iptal edildi."
set "L_C_DONE=[+] CUSTOM_LLM_API_KEY kaydedildi, provider config'e eklenecek."
set "L_SUM_HEAD=KURULUM BASLIYOR"
set "L_USER=User"
set "L_ADDR=Hitap"
set "L_TARG=Hedef"
set "L_S1=Klasorler olusturuluyor"
set "L_S2=Skills dosyalari kopyalaniyor"
set "L_S3=Agent, command, instruction, plugin kopyalaniyor"
set "L_S4=Rules.md olusturuluyor"
set "L_S5=opencode.jsonc olusturuluyor"
set "L_S6=Manifest yaziliyor"
set "L_S7=Arastirma skill'ine hitap isleniyor"
set "L_DONE_HEAD=KURULUM TAMAMLANDI!"
set "L_DONE_NOGH=GitHub MCP: kapali (key verilmedi)"
set "L_DONE_NOBRAVE=Brave arama: kapali (key verilmedi)"
set "L_DONE_NOCUST=Custom provider: yok (haziri kurulmaz)"
set "L_RUN_HINT1=[*] Baslatmak icin:"
set "L_RUN_HINT2=[*] ya da dogrudan:"
goto :eof

:lang_us
set "L_LANG_WORD=English"
set "L_USER_ASK=What is your username?"
set "L_ADDR_ASK=How should the agent address you?"
set "L_ADDR_DEF=Boss"
set "L_LANG=Language"
set "L_GH_INFO=Primary: GitHub API key(s). Leave empty to install GitHub MCP disabled."
set "L_GH_ASK=GitHub API keys - separate multiple with commas (ENTER = skip)"
set "L_GH_SKIP=[i] Skipped. To add later: setx GITHUB_API_KEY ..."
set "L_GH_SET1=[+] "
set "L_GH_SET2= GitHub keys saved (GITHUB_API_KEY_1..N). Not written to any file."
set "L_BRAVE_INFO=Secondary: Brave Search API key. Enables web search if provided."
set "L_BRAVE_ASK=Brave API key (ENTER = skip)"
set "L_BRAVE_SKIP=[i] Skipped. Brave web search installed disabled."
set "L_BRAVE_SET=[+] BRAVE_API_KEY saved, brave-search MCP will be enabled."
set "L_BAD_CHARS=[!] Invalid characters detected, try again."
set "L_EXTRA_HEAD=Any other integrations? Options:"
set "L_EXTRA_OPT1=  [1] Add a custom OpenAI-compatible provider (baseURL + model + key)"
set "L_EXTRA_OPT2=  [2] For built-in providers (OpenAI, Anthropic, Google...):"
set "L_EXTRA_OPT3=      run 'opencode auth login' after setup"
set "L_EXTRA_OPT4=  NO bundled provider ships with setup. Details: README"
set "L_EXTRA_ASK=Option number (ENTER = no, continue)"
set "L_CBASE=Base URL (e.g. https://api.example.com/v1)"
set "L_CMODEL=Model name (e.g. qwen-turbo-latest)"
set "L_CKEY=API key"
set "L_C_CANCEL=[i] Cancelled."
set "L_C_DONE=[+] CUSTOM_LLM_API_KEY saved, provider will be added to config."
set "L_SUM_HEAD=STARTING SETUP"
set "L_USER=User"
set "L_ADDR=Addressing"
set "L_TARG=Target"
set "L_S1=Creating folders"
set "L_S2=Copying skill files"
set "L_S3=Copying agents, commands, instructions, plugins"
set "L_S4=Generating rules.md"
set "L_S5=Generating opencode.jsonc"
set "L_S6=Writing manifest"
set "L_S7=Patching addressing into research skill"
set "L_DONE_HEAD=SETUP COMPLETE!"
set "L_DONE_NOGH=GitHub MCP: off (no key given)"
set "L_DONE_NOBRAVE=Brave search: off (no key given)"
set "L_DONE_NOCUST=Custom provider: none (nothing bundled)"
set "L_RUN_HINT1=[*] To launch:"
set "L_RUN_HINT2=[*] or directly:"
goto :eof

:lang_ru
set "L_LANG_WORD=Russkiy"
set "L_USER_ASK=Wawite imya polzovatelya?"
set "L_ADDR_ASK=Kak k vam obrashchatsya?"
set "L_ADDR_DEF=Tealax"
set "L_LANG=Yazyk"
set "L_GH_INFO=Pervichnyy: GitHub API klyuchi. Pustoy propusk = GitHub MCP vyklyuchen."
set "L_GH_ASK=GitHub API klyuchi - neskolko cherez zapyatuyu (ENTER = propustit)"
set "L_GH_SKIP=[i] Propushcheno. Dobavit pozzhe: setx GITHUB_API_KEY ..."
set "L_GH_SET1=[+] "
set "L_GH_SET2= GitHub klyucha sokhraneny (GITHUB_API_KEY_1..N). V fayly ne pishutsya."
set "L_BRAVE_INFO=Vtorichnyy: Brave Search API key. Vklyuchaet veb-poisk."
set "L_BRAVE_ASK=Brave API key (ENTER = propustit)"
set "L_BRAVE_SKIP=[i] Propushcheno. Brave veb-poisk ustanovlen vyklyuchennym."
set "L_BRAVE_SET=[+] BRAVE_API_KEY sokhranen, brave-search MCP budet aktivirovan."
set "L_BAD_CHARS=[!] Nedopustimye simvoly, povtorite."
set "L_EXTRA_HEAD=Yest' drugiye integratsii? Varianty:"
set "L_EXTRA_OPT1=  [1] Dobavit svoy OpenAI-sovmestimyy provider (baseURL + model + key)"
set "L_EXTRA_OPT2=  [2] Dlya vstroennykh provayderov (OpenAI, Anthropic, Google...):"
set "L_EXTRA_OPT3=      posle ustanovki zapustite 'opencode auth login'"
set "L_EXTRA_OPT4=  Gotovyy provider S USTANOVKOY ne idet. Podrobnee: README"
set "L_EXTRA_ASK=Nomer varianta (ENTER = net, dalshe)"
set "L_CBASE=Base URL (napr. https://api.example.com/v1)"
set "L_CMODEL=Imya modeli (napr. qwen-turbo-latest)"
set "L_CKEY=API key"
set "L_C_CANCEL=[i] Otmeneno."
set "L_C_DONE=[+] CUSTOM_LLM_API_KEY sokhranen, provider budet dobavlen v config."
set "L_SUM_HEAD=NACHINAEM USTANOVKU"
set "L_USER=Polzovatel"
set "L_ADDR=Obrashcheniye"
set "L_TARG=Put"
set "L_S1=Sozdayu papki"
set "L_S2=Kopiruyu fayly navykov"
set "L_S3=Kopiruyu agentov, komandy, instruktsii, plaginy"
set "L_S4=Generiruyu rules.md"
set "L_S5=Generiruyu opencode.jsonc"
set "L_S6=Pishu manifest"
set "L_S7=Vnosyu obrashcheniye v navyk issledovaniya"
set "L_DONE_HEAD=USTANOVKA ZAVERSHENA!"
set "L_DONE_NOGH=GitHub MCP: vykl (klyuch ne dan)"
set "L_DONE_NOBRAVE=Brave poisk: vykl (klyuch ne dan)"
set "L_DONE_NOCUST=Svoy provider: net (gotovyy ne stavitsya)"
set "L_RUN_HINT1=[*] Zapusk:"
set "L_RUN_HINT2=[*] ili napryamuyu:"
goto :eof
