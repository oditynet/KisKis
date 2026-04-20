(function() {
    if (window.catAnimationsLoaded) return;
    window.catAnimationsLoaded = true;
    
    const waitForCat = setInterval(() => {
        if (window.normalPose && window.catContainer) {
            clearInterval(waitForCat);
            initAnimations();
        }
    }, 50);
    
    function initAnimations() {
        console.log('Анимации запущены!');
        
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let mouseStopTimeout = null;
        let trackingActive = true;
        let currentMouseX = 0, currentMouseY = 0;
        
        let isAnimating = false;
        let lastTypingTime = 0;
        
        const np = window.normalPose;
        
        const funnyPhrases = [
"Моя бабушка быстрее печатает!",
"Ты что, двумя пальцами?",
"Клавиатуру сломал бы!",
"Я быстрее лапой набираю!",
"Где твои пальцы?",
"Печатай как ветер!",
"Это всё, на что ты способен?",
"Мяу! Жми быстрее!",
"Слишком медленно, человек!",
"Я заснул, пока ты печатал...",
"Улитка быстрее ползёт!",
"Тренируйся ещё!",
"Мой хвост быстрее двигается!",
"Котёнок и то быстрее!",
"Ты печатаешь или спишь?",
"Скорость улитки, честное слово!",
"Пальцы разморозь!",
"Клавиши не кусаются, жми!",
"Давай-давай, я жду!",
"Ты сегодня кушал? Сил нет печатать?",
"Эй, я же кот! Не обижай!",
"Я маленький, меня нельзя обижать!",
"Ну хватит, я обижусь!",
"Не трогай кота, а то поцарапаю!",
"Я тебе доверял, а ты...",
"Котики не прощают обид!",
"Всё, я в домике!",
"Обидно, между прочим!",
"Ты зачем кота расстраиваешь?",
"Не обижай, а то уйду!"
        ];
        
        // ========== МУХА ==========
        const flyElement = document.createElement('div');
        flyElement.style.cssText = `
            position: fixed;
            width: 24px;
            height: 24px;
            z-index: 999998;
            pointer-events: none;
            display: none;
        `;
        flyElement.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <ellipse cx="8" cy="12" rx="6" ry="4" fill="none" stroke="#222" stroke-width="1.5"/>
                <ellipse cx="16" cy="12" rx="6" ry="4" fill="none" stroke="#222" stroke-width="1.5"/>
                <ellipse cx="12" cy="12" rx="3" ry="2" fill="#222"/>
            </svg>
        `;
        document.body.appendChild(flyElement);
        
        let flyActive = false;
        let flyX = 0, flyY = 0;
        let flyInterval = null;
        
        // ========== СЛЕЖЕНИЕ ЗА КУРСОРОМ (ГЛАЗА + УШИ) ==========
        function updatePupilsAndEars(mouseX, mouseY) {
            if (isDragging || !np || isAnimating) return;
            
            const catRect = window.catContainer.getBoundingClientRect();
            const catCenterX = catRect.left + catRect.width / 2;
            const catCenterY = catRect.top + catRect.height / 2;
            
            let dx = (mouseX - catCenterX) / 20;
            let dy = (mouseY - catCenterY) / 20;
            
            const maxOffset = np.leftEyeRx - np.leftPupilR - 2;
            dx = Math.max(-maxOffset, Math.min(maxOffset, dx));
            dy = Math.max(-maxOffset, Math.min(maxOffset, dy));
            
            window.leftPupil.setAttribute("cx", np.leftPupilCx + dx);
            window.leftPupil.setAttribute("cy", np.leftPupilCy + dy);
            window.rightPupil.setAttribute("cx", np.rightPupilCx + dx);
            window.rightPupil.setAttribute("cy", np.rightPupilCy + dy);
            
            window.leftHighlight.setAttribute("cx", np.leftHighCx + dx * 0.7);
            window.leftHighlight.setAttribute("cy", np.leftHighCy + dy * 0.7);
            window.rightHighlight.setAttribute("cx", np.rightHighCx + dx * 0.7);
            window.rightHighlight.setAttribute("cy", np.rightHighCy + dy * 0.7);
            
            // УШИ НАКЛОНЯЮТСЯ
            const earTilt = dx * 0.8;
            const limitedEarTilt = Math.max(-15, Math.min(15, earTilt));
            
            window.leftEar.setAttribute("transform", `rotate(${limitedEarTilt}, 102, 170)`);
            window.leftEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 104, 167)`);
            window.rightEar.setAttribute("transform", `rotate(${limitedEarTilt}, 178, 168)`);
            window.rightEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 176, 165)`);
        }
        
        function resetPupilsAndEars() {
            if (!np) return;
            
            window.leftPupil.setAttribute("cx", np.leftPupilCx);
            window.leftPupil.setAttribute("cy", np.leftPupilCy);
            window.rightPupil.setAttribute("cx", np.rightPupilCx);
            window.rightPupil.setAttribute("cy", np.rightPupilCy);
            window.leftHighlight.setAttribute("cx", np.leftHighCx);
            window.leftHighlight.setAttribute("cy", np.leftHighCy);
            window.rightHighlight.setAttribute("cx", np.rightHighCx);
            window.rightHighlight.setAttribute("cy", np.rightHighCy);
            
            window.leftEar.setAttribute("transform", "");
            window.rightEar.setAttribute("transform", "");
            window.leftEarInner.setAttribute("transform", "");
            window.rightEarInner.setAttribute("transform", "");
        }
        
        // ========== ФУНКЦИЯ ПЕРЕРИСОВКИ ПРИ ЗАХВАТЕ ==========
        window.setDraggingPose = function(dragging) {
            if (!np || isAnimating) return;
            
            if (dragging) {
                const headBottom = np.headCy + np.headRy;
                window.head.setAttribute("d", `M ${np.headCx},${np.headCy - np.headRy} C ${np.headCx + np.headRx},${np.headCy - np.headRy} ${np.headCx + np.headRx},${headBottom + 15} ${np.headCx},${headBottom + 25} C ${np.headCx - np.headRx},${headBottom + 15} ${np.headCx - np.headRx},${np.headCy - np.headRy} ${np.headCx},${np.headCy - np.headRy} Z`);
                
                const bodyShiftY = 12;
                const newBodyCy = np.bodyCy + bodyShiftY;
                const newBodyRy = np.bodyRy * 1.25;
                const newBodyBottom = newBodyCy + newBodyRy;
                
                window.body.setAttribute("cy", newBodyCy);
                window.body.setAttribute("ry", newBodyRy);
                window.shadow.setAttribute("cy", np.shadowCy + bodyShiftY + 8);
                window.backLegLeft.setAttribute("cy", np.backLegLeftCy + bodyShiftY + 8);
                window.backLegRight.setAttribute("cy", np.backLegRightCy + bodyShiftY + 8);
                
                const armStartY = newBodyBottom - 5;
                const armEndY = newBodyBottom + 12;
                
                window.leftArm.setAttribute("y1", armStartY);
                window.leftArm.setAttribute("y2", armEndY);
                window.rightArm.setAttribute("y1", armStartY);
                window.rightArm.setAttribute("y2", armEndY);
                window.leftPaw.setAttribute("cy", armEndY);
                window.rightPaw.setAttribute("cy", armEndY);
                
                window.tail.setAttribute("d", `M 180,${newBodyCy} Q 220,${newBodyCy + 25} 235,${newBodyCy + 40}`);
                
                const faceShiftY = 18;
                window.leftEye.setAttribute("cy", np.leftEyeCy + faceShiftY);
                window.rightEye.setAttribute("cy", np.rightEyeCy + faceShiftY);
                window.leftPupil.setAttribute("cy", np.leftPupilCy + faceShiftY);
                window.rightPupil.setAttribute("cy", np.rightPupilCy + faceShiftY);
                window.leftHighlight.setAttribute("cy", np.leftHighCy + faceShiftY);
                window.rightHighlight.setAttribute("cy", np.rightHighCy + faceShiftY);
                
                window.nose.setAttribute("points", `135,${228 + faceShiftY} 142,${228 + faceShiftY} 138,${233 + faceShiftY}`);
                window.mouth.setAttribute("d", `M 131,${242 + faceShiftY} Q 138,${248 + faceShiftY} 145,${242 + faceShiftY}`);
                window.whiskers.setAttribute("d", `M 98,${220 + faceShiftY} L 55,${235 + faceShiftY} M 98,${228 + faceShiftY} L 55,${250 + faceShiftY} M 172,${218 + faceShiftY} L 215,${235 + faceShiftY} M 172,${226 + faceShiftY} L 215,${250 + faceShiftY}`);
                
                window.catContainer.classList.add('dragging');
            } else {
                window.head.setAttribute("d", "");
                window.head.setAttribute("cx", np.headCx);
                window.head.setAttribute("cy", np.headCy);
                window.head.setAttribute("rx", np.headRx);
                window.head.setAttribute("ry", np.headRy);
                
                window.body.setAttribute("cy", np.bodyCy);
                window.body.setAttribute("rx", np.bodyRx);
                window.body.setAttribute("ry", np.bodyRy);
                window.shadow.setAttribute("cy", np.shadowCy);
                window.backLegLeft.setAttribute("cy", np.backLegLeftCy);
                window.backLegRight.setAttribute("cy", np.backLegRightCy);
                
                window.leftArm.setAttribute("x1", np.leftArmX1);
                window.leftArm.setAttribute("y1", np.leftArmY1);
                window.leftArm.setAttribute("x2", np.leftArmX2);
                window.leftArm.setAttribute("y2", np.leftArmY2);
                window.rightArm.setAttribute("x1", np.rightArmX1);
                window.rightArm.setAttribute("y1", np.rightArmY1);
                window.rightArm.setAttribute("x2", np.rightArmX2);
                window.rightArm.setAttribute("y2", np.rightArmY2);
                
                window.leftPaw.setAttribute("cx", np.leftPawCx);
                window.leftPaw.setAttribute("cy", np.leftPawCy);
                window.rightPaw.setAttribute("cx", np.rightPawCx);
                window.rightPaw.setAttribute("cy", np.rightPawCy);
                
                window.tail.setAttribute("d", np.tailD);
                
                window.leftEye.setAttribute("cy", np.leftEyeCy);
                window.rightEye.setAttribute("cy", np.rightEyeCy);
                window.leftPupil.setAttribute("cx", np.leftPupilCx);
                window.leftPupil.setAttribute("cy", np.leftPupilCy);
                window.rightPupil.setAttribute("cx", np.rightPupilCx);
                window.rightPupil.setAttribute("cy", np.rightPupilCy);
                window.leftHighlight.setAttribute("cx", np.leftHighCx);
                window.leftHighlight.setAttribute("cy", np.leftHighCy);
                window.rightHighlight.setAttribute("cx", np.rightHighCx);
                window.rightHighlight.setAttribute("cy", np.rightHighCy);
                
                window.nose.setAttribute("points", np.nosePoints);
                window.mouth.setAttribute("d", np.mouthD);
                window.whiskers.setAttribute("d", np.whiskersD);
                
                window.catContainer.classList.remove('dragging');
            }
        };
        
        // ========== ПЕРЕМЕЩЕНИЕ КОТА ==========
        window.catContainer.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || isAnimating) return;
            e.preventDefault();
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = window.catContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            window.setDraggingPose(true);
            
            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                let newLeft = startLeft + dx;
                let newTop = startTop + dy;
                
                newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));
                
                window.catContainer.style.left = newLeft + 'px';
                window.catContainer.style.top = newTop + 'px';
                window.catContainer.style.right = 'auto';
                window.catContainer.style.bottom = 'auto';
            };
            
            const onMouseUp = () => {
                isDragging = false;
                window.setDraggingPose(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        // ========== СЛЕЖЕНИЕ ЗА МЫШКОЙ ==========
        document.addEventListener('mousemove', (e) => {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
            
            if (isDragging || isAnimating) return;
            
            if (mouseStopTimeout) clearTimeout(mouseStopTimeout);
            
            trackingActive = true;
            updatePupilsAndEars(e.clientX, e.clientY);
            
            mouseStopTimeout = setTimeout(() => {
                trackingActive = false;
                resetPupilsAndEars();
            }, 3000);
        });
        
        // ========== ОТСЛЕЖИВАНИЕ ПЕЧАТИ ==========
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                lastTypingTime = Date.now();
                
                const targetRect = e.target.getBoundingClientRect();
                updatePupilsAndEars(targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height / 2);
                
                setTimeout(() => {
                    if (Date.now() - lastTypingTime >= 2500 && !isAnimating && !isDragging && !flyActive) {
                        const phrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)];
                        window.speechText.textContent = phrase;
                        window.speechBubble.style.display = "block";
                        setTimeout(() => window.speechBubble.style.display = "none", 8000);
                    }
                }, 2500);
            }
        });
        
        // ========== АНИМАЦИИ ==========

// ========== АНИМАЦИЯ: МУХА (ТОЧНО ЛОВИТ) ==========
function flyAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        flyActive = true;
        
        const catRect = window.catContainer.getBoundingClientRect();
        
        // Муха появляется справа от кота
        flyX = catRect.right + 70;
        flyY = catRect.top + catRect.height / 2 - 30;
        flyElement.style.left = flyX + 'px';
        flyElement.style.top = flyY + 'px';
        flyElement.style.display = 'block';
        
        // МЕДЛЕННЕЕ, чтобы кот успел среагировать
        let flySpeedX = -1.2;
        let flySpeedY = (Math.random() - 0.5) * 1.0;
        let startTime = Date.now();
        let canHit = true;
        let hitCount = 0;
        
        // Функция слежения за мухой
        function trackFly() {
            const catRect2 = window.catContainer.getBoundingClientRect();
            const catCenterX = catRect2.left + catRect2.width / 2;
            const catCenterY = catRect2.top + catRect2.height / 2;
            
            let dx = (flyX - catCenterX) / 15;
            let dy = (flyY - catCenterY) / 15;
            
            const maxOffset = np.leftEyeRx - np.leftPupilR - 2;
            dx = Math.max(-maxOffset, Math.min(maxOffset, dx));
            dy = Math.max(-maxOffset, Math.min(maxOffset, dy));
            
            window.leftPupil.setAttribute("cx", np.leftPupilCx + dx);
            window.leftPupil.setAttribute("cy", np.leftPupilCy + dy);
            window.rightPupil.setAttribute("cx", np.rightPupilCx + dx);
            window.rightPupil.setAttribute("cy", np.rightPupilCy + dy);
            
            window.leftHighlight.setAttribute("cx", np.leftHighCx + dx * 0.7);
            window.leftHighlight.setAttribute("cy", np.leftHighCy + dy * 0.7);
            window.rightHighlight.setAttribute("cx", np.rightHighCx + dx * 0.7);
            window.rightHighlight.setAttribute("cy", np.rightHighCy + dy * 0.7);
            
            const earTilt = dx * 1.2;
            const limitedEarTilt = Math.max(-15, Math.min(15, earTilt));
            
            window.leftEar.setAttribute("transform", `rotate(${limitedEarTilt}, 102, 170)`);
            window.leftEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 104, 167)`);
            window.rightEar.setAttribute("transform", `rotate(${limitedEarTilt}, 178, 168)`);
            window.rightEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 176, 165)`);
        }
        
        flyInterval = setInterval(() => {
            if (!flyActive) return;
            
            // Таймаут 6 секунд
            if (Date.now() - startTime > 6000) {
                flyActive = false;
                flyElement.style.display = 'none';
                clearInterval(flyInterval);
                resetPupilsAndEars();
                isAnimating = false;
                resolve();
                return;
            }
            
            // Движение мухи
            flyX += flySpeedX;
            flyY += flySpeedY;
            
            // Отскок от краёв
            if (flyX < 20) flySpeedX = Math.abs(flySpeedX);
            if (flyX > window.innerWidth - 20) flySpeedX = -Math.abs(flySpeedX);
            if (flyY < 20) flySpeedY = Math.abs(flySpeedY);
            if (flyY > window.innerHeight - 20) flySpeedY = -Math.abs(flySpeedY);
            
            flyElement.style.left = flyX + 'px';
            flyElement.style.top = flyY + 'px';
            
            // Кот следит
            trackFly();
            
            // ПРОВЕРКА УДАРА
            if (canHit) {
                const catRect2 = window.catContainer.getBoundingClientRect();
                
                // Вычисляем ЭКРАННЫЕ координаты лап
                // Левая лапа: x1=118, y1=308, x2=112, y2=335
                const leftPawScreenX = catRect2.left + 112;
                const leftPawScreenY = catRect2.top + 335;
                
                // Правая лапа: x1=168, y1=308, x2=174, y2=335
                const rightPawScreenX = catRect2.left + 174;
                const rightPawScreenY = catRect2.top + 335;
                
                // Расстояние до лап
                const distToLeft = Math.sqrt(Math.pow(flyX - leftPawScreenX, 2) + Math.pow(flyY - leftPawScreenY, 2));
                const distToRight = Math.sqrt(Math.pow(flyX - rightPawScreenX, 2) + Math.pow(flyY - rightPawScreenY, 2));
                
                // УВЕЛИЧЕННЫЙ РАДИУС ДО 100 ПИКСЕЛЕЙ
                if (distToLeft < 100 || distToRight < 100) {
                    canHit = false;
                    hitCount++;
                    
                    console.log('💥 УДАР! Муха на расстоянии:', Math.min(distToLeft, distToRight));
                    
                    const useLeftPaw = distToLeft < distToRight;
                    
                    if (useLeftPaw) {
                        // Удар левой лапой
                        const hitX = flyX - catRect2.left + 15;
                        const hitY = flyY - catRect2.top - 10;
                        
                        window.leftArm.setAttribute("x2", hitX);
                        window.leftArm.setAttribute("y2", hitY);
                        window.leftPaw.setAttribute("cx", hitX);
                        window.leftPaw.setAttribute("cy", hitY);
                        
                        setTimeout(() => {
                            window.leftArm.setAttribute("x2", np.leftArmX2);
                            window.leftArm.setAttribute("y2", np.leftArmY2);
                            window.leftPaw.setAttribute("cx", np.leftPawCx);
                            window.leftPaw.setAttribute("cy", np.leftPawCy);
                        }, 200);
                    } else {
                        // Удар правой лапой
                        const hitX = flyX - catRect2.left - 15;
                        const hitY = flyY - catRect2.top - 10;
                        
                        window.rightArm.setAttribute("x2", hitX);
                        window.rightArm.setAttribute("y2", hitY);
                        window.rightPaw.setAttribute("cx", hitX);
                        window.rightPaw.setAttribute("cy", hitY);
                        
                        setTimeout(() => {
                            window.rightArm.setAttribute("x2", np.rightArmX2);
                            window.rightArm.setAttribute("y2", np.rightArmY2);
                            window.rightPaw.setAttribute("cx", np.rightPawCx);
                            window.rightPaw.setAttribute("cy", np.rightPawCy);
                        }, 200);
                    }
                    
                    // МУХА ИСЧЕЗАЕТ
                    setTimeout(() => {
                        flyActive = false;
                        flyElement.style.display = 'none';
                        clearInterval(flyInterval);
                        resetPupilsAndEars();
                        isAnimating = false;
                        resolve();
                    }, 100);
                }
            }
        }, 40); // Частота обновления
    });
}

        function walkAnimation() {
            return new Promise((resolve) => {
                isAnimating = true;
                
                const startLeft = window.catContainer.offsetLeft;
                let step = 0;
                
                const walkInterval = setInterval(() => {
                    if (step < 6) {
                        if (step < 3) {
                            window.catContainer.style.left = (startLeft - step * 10) + 'px';
                        } else {
                            window.catContainer.style.left = (startLeft - 30 + (step - 3) * 10) + 'px';
                        }
                        
                        if (step % 2 === 0) {
                            window.leftArm.setAttribute("x2", String(parseInt(window.leftArm.getAttribute("x2")) - 4));
                            window.rightArm.setAttribute("x2", String(parseInt(window.rightArm.getAttribute("x2")) + 4));
                        } else {
                            window.leftArm.setAttribute("x2", np.leftArmX2);
                            window.rightArm.setAttribute("x2", np.rightArmX2);
                        }
                        
                        step++;
                    } else {
                        clearInterval(walkInterval);
                        window.catContainer.style.left = startLeft + 'px';
                        window.leftArm.setAttribute("x2", np.leftArmX2);
                        window.rightArm.setAttribute("x2", np.rightArmX2);
                        isAnimating = false;
                        resolve();
                    }
                }, 180);
            });
        }
        
function poopAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        // КОТ ОСТАЁТСЯ НЕПОДВИЖНЫМ
        
        // Какашка появляется из-под хвоста (справа)
        window.poopGroup.style.display = "block";
        window.poopBottom.setAttribute("cx", "195");
        window.poopTop.setAttribute("cx", "195");
        window.poopBottom.setAttribute("cy", "300");
        window.poopTop.setAttribute("cy", "290");
        
        let poopY = 300;
        let phase = 0; // 0 - падение, 1 - закапывание
        let buryCount = 0;
        let activePaw = 'left'; // 'left' или 'right'
        let swingOffset = 0;
        let swingDirection = 1; // 1 - вправо, -1 - влево
        let returningToCenter = false;
        
        const poopInterval = setInterval(() => {
            if (phase === 0) {
                // ПАДЕНИЕ КАКАШКИ
                poopY += 2;
                window.poopBottom.setAttribute("cy", poopY);
                window.poopTop.setAttribute("cy", poopY - 10);
                
                if (poopY >= 340) {
                    phase = 1;
                }
            } else if (phase === 1) {
                // ЗАКАПЫВАНИЕ - ЛАПЫ ПО ОЧЕРЕДИ
                
                if (!returningToCenter) {
                    // Движение лапы в сторону
                    swingOffset += swingDirection * 10;
                    
                    if (swingOffset >= 25) {
                        // Достигли крайнего положения, начинаем возврат
                        returningToCenter = true;
                        swingDirection = -1;
                    }
                } else {
                    // Возврат лапы в центр
                    swingOffset += swingDirection * 10;
                    
                    if (swingOffset <= 0) {
                        // Вернулись в центр
                        swingOffset = 0;
                        returningToCenter = false;
                        swingDirection = 1;
                        
                        // Меняем активную лапу
                        activePaw = activePaw === 'left' ? 'right' : 'left';
                        buryCount++;
                    }
                }
                
                // Применяем смещение к активной лапе
                if (activePaw === 'left') {
                    // Левая лапа двигается, правая на месте
                    const leftBaseX = np.leftArmX1;
                    const leftBaseY = np.leftArmY1;
                    
                    if (!returningToCenter) {
                        // Движение вправо-вниз
                        window.leftArm.setAttribute("x2", leftBaseX + swingOffset);
                        window.leftArm.setAttribute("y2", leftBaseY + 25 + swingOffset * 0.5);
                        window.leftPaw.setAttribute("cx", leftBaseX + swingOffset);
                        window.leftPaw.setAttribute("cy", leftBaseY + 25 + swingOffset * 0.5);
                    } else {
                        // Возврат
                        window.leftArm.setAttribute("x2", leftBaseX + swingOffset);
                        window.leftArm.setAttribute("y2", leftBaseY + 25 + swingOffset * 0.5);
                        window.leftPaw.setAttribute("cx", leftBaseX + swingOffset);
                        window.leftPaw.setAttribute("cy", leftBaseY + 25 + swingOffset * 0.5);
                    }
                    
                    // Правая лапа остаётся на месте
                    window.rightArm.setAttribute("x2", np.rightArmX2);
                    window.rightArm.setAttribute("y2", np.rightArmY2);
                    window.rightPaw.setAttribute("cx", np.rightPawCx);
                    window.rightPaw.setAttribute("cy", np.rightPawCy);
                    
                } else {
                    // Правая лапа двигается, левая на месте
                    const rightBaseX = np.rightArmX1;
                    const rightBaseY = np.rightArmY1;
                    
                    if (!returningToCenter) {
                        // Движение влево-вниз
                        window.rightArm.setAttribute("x2", rightBaseX - swingOffset);
                        window.rightArm.setAttribute("y2", rightBaseY + 25 + swingOffset * 0.5);
                        window.rightPaw.setAttribute("cx", rightBaseX - swingOffset);
                        window.rightPaw.setAttribute("cy", rightBaseY + 25 + swingOffset * 0.5);
                    } else {
                        // Возврат
                        window.rightArm.setAttribute("x2", rightBaseX - swingOffset);
                        window.rightArm.setAttribute("y2", rightBaseY + 25 + swingOffset * 0.5);
                        window.rightPaw.setAttribute("cx", rightBaseX - swingOffset);
                        window.rightPaw.setAttribute("cy", rightBaseY + 25 + swingOffset * 0.5);
                    }
                    
                    // Левая лапа остаётся на месте
                    window.leftArm.setAttribute("x2", np.leftArmX2);
                    window.leftArm.setAttribute("y2", np.leftArmY2);
                    window.leftPaw.setAttribute("cx", np.leftPawCx);
                    window.leftPaw.setAttribute("cy", np.leftPawCy);
                }
                
                // Закапывание длится 6 циклов (по 3 на каждую лапу)
                if (buryCount >= 6) {
                    clearInterval(poopInterval);
                    window.poopGroup.style.display = "none";
                    
                    // Возврат обеих лап в исходное положение
                    window.leftArm.setAttribute("x2", np.leftArmX2);
                    window.leftArm.setAttribute("y2", np.leftArmY2);
                    window.leftPaw.setAttribute("cx", np.leftPawCx);
                    window.leftPaw.setAttribute("cy", np.leftPawCy);
                    
                    window.rightArm.setAttribute("x2", np.rightArmX2);
                    window.rightArm.setAttribute("y2", np.rightArmY2);
                    window.rightPaw.setAttribute("cx", np.rightPawCx);
                    window.rightPaw.setAttribute("cy", np.rightPawCy);
                    
                    // Возврат позиции какашки
                    window.poopBottom.setAttribute("cx", "178");
                    window.poopTop.setAttribute("cx", "178");
                    
                    isAnimating = false;
                    resolve();
                }
            }
        }, 80);
    });
}        
        function yawnAnimation() {
            return new Promise((resolve) => {
                isAnimating = true;
                
                window.head.setAttribute("ry", "55");
                
                const shiftUp = -15;
                window.leftEye.setAttribute("cy", np.leftEyeCy + shiftUp);
                window.rightEye.setAttribute("cy", np.rightEyeCy + shiftUp);
                window.leftPupil.setAttribute("cy", np.leftPupilCy + shiftUp);
                window.rightPupil.setAttribute("cy", np.rightPupilCy + shiftUp);
                window.leftHighlight.setAttribute("cy", np.leftHighCy + shiftUp);
                window.rightHighlight.setAttribute("cy", np.rightHighCy + shiftUp);
                
                window.nose.setAttribute("points", `135,${228 + shiftUp} 142,${228 + shiftUp} 138,${233 + shiftUp}`);
                window.whiskers.setAttribute("d", `M 98,${220 + shiftUp} L 55,${215 + shiftUp} M 98,${228 + shiftUp} L 55,${230 + shiftUp} M 172,${218 + shiftUp} L 215,${212 + shiftUp} M 172,${226 + shiftUp} L 215,${228 + shiftUp}`);
                
                window.mouth.remove();
                
                const yawnMouth = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                yawnMouth.setAttribute("cx", "138");
                yawnMouth.setAttribute("cy", "248");
                yawnMouth.setAttribute("r", "20");
                yawnMouth.setAttribute("fill", "#1a1a1a");
                yawnMouth.setAttribute("stroke", "#222");
                yawnMouth.setAttribute("stroke-width", "3");
                window.catGroup.appendChild(yawnMouth);
                
                const tongue = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                tongue.setAttribute("cx", "138");
                tongue.setAttribute("cy", "255");
                tongue.setAttribute("rx", "8");
                tongue.setAttribute("ry", "5");
                tongue.setAttribute("fill", "#ff8888");
                window.catGroup.appendChild(tongue);
                
                setTimeout(() => {
                    window.head.setAttribute("ry", np.headRy);
                    
                    window.leftEye.setAttribute("cy", np.leftEyeCy);
                    window.rightEye.setAttribute("cy", np.rightEyeCy);
                    window.leftPupil.setAttribute("cy", np.leftPupilCy);
                    window.rightPupil.setAttribute("cy", np.rightPupilCy);
                    window.leftHighlight.setAttribute("cy", np.leftHighCy);
                    window.rightHighlight.setAttribute("cy", np.rightHighCy);
                    
                    window.nose.setAttribute("points", np.nosePoints);
                    window.whiskers.setAttribute("d", np.whiskersD);
                    
                    yawnMouth.remove();
                    tongue.remove();
                    
                    window.catGroup.appendChild(window.mouth);
                    window.mouth.setAttribute("d", np.mouthD);
                    window.mouth.setAttribute("fill", "none");
                    window.mouth.setAttribute("stroke", "#222");
                    window.mouth.setAttribute("stroke-width", "2.5");
                    
                    isAnimating = false;
                    resolve();
                }, 2500);
            });
        }
        
        // ========== РАНДОМНЫЙ ЦИКЛ ==========
        const animations = [flyAnimation, walkAnimation, poopAnimation, yawnAnimation];
        
        async function randomAnimationCycle() {
            while (true) {
                await new Promise(r => setTimeout(r, 25000));// анимация каждые 25 сек
                
                if (!isDragging && !isAnimating && !flyActive) {
                    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                    await randomAnim();
                    resetPupilsAndEars();
                }
            }
        }
        
        randomAnimationCycle();
        
        console.log('✅ Кот готов!');
    }
})();
