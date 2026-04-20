// ========== КОТ (ЗАДНИЕ ЛАПЫ БОЛЬШИЕ, ПЕРЕДНИЕ - ПАЛОЧКИ) ==========
(function() {
    if (window.catStaticLoaded) return;
    window.catStaticLoaded = true;

    const svgNS = "http://www.w3.org/2000/svg";
    
    window.catContainer = document.createElement('div');
    window.catContainer.className = 'cat-addon';
    window.catContainer.style.bottom = '20px';
    window.catContainer.style.right = '20px';
    window.catContainer.style.top = 'auto';
    window.catContainer.style.left = 'auto';
    
    window.svg = document.createElementNS(svgNS, "svg");
    window.svg.setAttribute("viewBox", "0 0 300 380");
    window.svg.setAttribute("class", "cat-svg");
    
    window.catGroup = document.createElementNS(svgNS, "g");
    window.catGroup.setAttribute("id", "cat-group");
    
    // ---- ТЕНЬ ----
    window.shadow = document.createElementNS(svgNS, "ellipse");
    window.shadow.setAttribute("cx", "150");
    window.shadow.setAttribute("cy", "325");
    window.shadow.setAttribute("rx", "75");
    window.shadow.setAttribute("ry", "6");
    window.shadow.setAttribute("fill", "rgba(0,0,0,0.15)");
    window.catGroup.appendChild(window.shadow);
    
    // ---- ХВОСТ ----
    window.tail = document.createElementNS(svgNS, "path");
    window.tail.setAttribute("d", "M 180,290 Q 230,270 240,230 Q 245,200 230,190");
    window.tail.setAttribute("fill", "none");
    window.tail.setAttribute("stroke", "#222");
    window.tail.setAttribute("stroke-width", "4");
    window.tail.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.tail);
    
    // ---- ТЕЛО ----
    window.body = document.createElementNS(svgNS, "ellipse");
    window.body.setAttribute("cx", "145");
    window.body.setAttribute("cy", "285");
    window.body.setAttribute("rx", "38");
    window.body.setAttribute("ry", "35");
    window.body.setAttribute("fill", "#FFFFFF");
    window.body.setAttribute("stroke", "#222");
    window.body.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.body);
    
    // ========== БОЛЬШИЕ ЗАДНИЕ ЛАПЫ (близко к телу) ==========
    // Левая задняя лапа
    window.backLegLeft = document.createElementNS(svgNS, "ellipse");
    window.backLegLeft.setAttribute("cx", "115");
    window.backLegLeft.setAttribute("cy", "315");
    window.backLegLeft.setAttribute("rx", "18");
    window.backLegLeft.setAttribute("ry", "8");
    window.backLegLeft.setAttribute("fill", "#FFFFFF");
    window.backLegLeft.setAttribute("stroke", "#222");
    window.backLegLeft.setAttribute("stroke-width", "4");
    window.catGroup.appendChild(window.backLegLeft);
    
    // Правая задняя лапа
    window.backLegRight = document.createElementNS(svgNS, "ellipse");
    window.backLegRight.setAttribute("cx", "175");
    window.backLegRight.setAttribute("cy", "315");
    window.backLegRight.setAttribute("rx", "18");
    window.backLegRight.setAttribute("ry", "8");
    window.backLegRight.setAttribute("fill", "#FFFFFF");
    window.backLegRight.setAttribute("stroke", "#222");
    window.backLegRight.setAttribute("stroke-width", "4");
    window.catGroup.appendChild(window.backLegRight);
    
    // ========== ПЕРЕДНИЕ ЛАПЫ (палочки из середины тела) ==========
    // Левая передняя лапа (палочка)
    window.leftArm = document.createElementNS(svgNS, "line");
    window.leftArm.setAttribute("x1", "130");
    window.leftArm.setAttribute("y1", "305");
    window.leftArm.setAttribute("x2", "125");
    window.leftArm.setAttribute("y2", "330");
    window.leftArm.setAttribute("stroke", "#222");
    window.leftArm.setAttribute("stroke-width", "3");
    window.leftArm.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.leftArm);
    
    // Правая передняя лапа (палочка)
    window.rightArm = document.createElementNS(svgNS, "line");
    window.rightArm.setAttribute("x1", "160");
    window.rightArm.setAttribute("y1", "305");
    window.rightArm.setAttribute("x2", "165");
    window.rightArm.setAttribute("y2", "330");
    window.rightArm.setAttribute("stroke", "#222");
    window.rightArm.setAttribute("stroke-width", "3");
    window.rightArm.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.rightArm);
    
    // Маленькие овалы на концах передних лап
    window.leftPaw = document.createElementNS(svgNS, "ellipse");
    window.leftPaw.setAttribute("cx", "125");
    window.leftPaw.setAttribute("cy", "328");
    window.leftPaw.setAttribute("rx", "8");
    window.leftPaw.setAttribute("ry", "4");
    window.leftPaw.setAttribute("fill", "#FFFFFF");
    window.leftPaw.setAttribute("stroke", "#222");
    window.leftPaw.setAttribute("stroke-width", "2");
    window.catGroup.appendChild(window.leftPaw);
    
    window.rightPaw = document.createElementNS(svgNS, "ellipse");
    window.rightPaw.setAttribute("cx", "165");
    window.rightPaw.setAttribute("cy", "328");
    window.rightPaw.setAttribute("rx", "8");
    window.rightPaw.setAttribute("ry", "4");
    window.rightPaw.setAttribute("fill", "#FFFFFF");
    window.rightPaw.setAttribute("stroke", "#222");
    window.rightPaw.setAttribute("stroke-width", "2");
    window.catGroup.appendChild(window.rightPaw);
    
    // ---- ГОЛОВА ----
    window.head = document.createElementNS(svgNS, "ellipse");
    window.head.setAttribute("cx", "145");
    window.head.setAttribute("cy", "210");
    window.head.setAttribute("rx", "52");
    window.head.setAttribute("ry", "48");
    window.head.setAttribute("fill", "#FFFFFF");
    window.head.setAttribute("stroke", "#222");
    window.head.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.head);
    
    // ---- УШИ ----
    window.leftEar = document.createElementNS(svgNS, "polygon");
    window.leftEar.setAttribute("points", "105,170 93,138 121,158");
    window.leftEar.setAttribute("fill", "#FFFFFF");
    window.leftEar.setAttribute("stroke", "#222");
    window.leftEar.setAttribute("stroke-width", "3");
    window.leftEar.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.leftEar);
    
    window.rightEar = document.createElementNS(svgNS, "polygon");
    window.rightEar.setAttribute("points", "181,168 193,136 165,156");
    window.rightEar.setAttribute("fill", "#FFFFFF");
    window.rightEar.setAttribute("stroke", "#222");
    window.rightEar.setAttribute("stroke-width", "3");
    window.rightEar.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.rightEar);
    
    window.leftEarInner = document.createElementNS(svgNS, "polygon");
    window.leftEarInner.setAttribute("points", "107,167 97,143 119,160");
    window.leftEarInner.setAttribute("fill", "#E0E0E0");
    window.leftEarInner.setAttribute("stroke", "#222");
    window.leftEarInner.setAttribute("stroke-width", "2");
    window.leftEarInner.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.leftEarInner);
    
    window.rightEarInner = document.createElementNS(svgNS, "polygon");
    window.rightEarInner.setAttribute("points", "179,165 189,141 167,158");
    window.rightEarInner.setAttribute("fill", "#E0E0E0");
    window.rightEarInner.setAttribute("stroke", "#222");
    window.rightEarInner.setAttribute("stroke-width", "2");
    window.rightEarInner.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.rightEarInner);
    
    // ---- ГЛАЗА ----
    window.leftEye = document.createElementNS(svgNS, "ellipse");
    window.leftEye.setAttribute("cx", "120");
    window.leftEye.setAttribute("cy", "205");
    window.leftEye.setAttribute("rx", "12");
    window.leftEye.setAttribute("ry", "14");
    window.leftEye.setAttribute("fill", "#FFFFFF");
    window.leftEye.setAttribute("stroke", "#222");
    window.leftEye.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.leftEye);
    
    window.rightEye = document.createElementNS(svgNS, "ellipse");
    window.rightEye.setAttribute("cx", "168");
    window.rightEye.setAttribute("cy", "203");
    window.rightEye.setAttribute("rx", "12");
    window.rightEye.setAttribute("ry", "14");
    window.rightEye.setAttribute("fill", "#FFFFFF");
    window.rightEye.setAttribute("stroke", "#222");
    window.rightEye.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.rightEye);
    
    // ---- ЗРАЧКИ ----
    window.leftPupil = document.createElementNS(svgNS, "circle");
    window.leftPupil.setAttribute("cx", "118");
    window.leftPupil.setAttribute("cy", "205");
    window.leftPupil.setAttribute("r", "5");
    window.leftPupil.setAttribute("fill", "#222");
    window.catGroup.appendChild(window.leftPupil);
    
    window.rightPupil = document.createElementNS(svgNS, "circle");
    window.rightPupil.setAttribute("cx", "166");
    window.rightPupil.setAttribute("cy", "203");
    window.rightPupil.setAttribute("r", "5");
    window.rightPupil.setAttribute("fill", "#222");
    window.catGroup.appendChild(window.rightPupil);
    
    window.leftHighlight = document.createElementNS(svgNS, "circle");
    window.leftHighlight.setAttribute("cx", "115");
    window.leftHighlight.setAttribute("cy", "200");
    window.leftHighlight.setAttribute("r", "2.5");
    window.leftHighlight.setAttribute("fill", "#FFFFFF");
    window.catGroup.appendChild(window.leftHighlight);
    
    window.rightHighlight = document.createElementNS(svgNS, "circle");
    window.rightHighlight.setAttribute("cx", "163");
    window.rightHighlight.setAttribute("cy", "198");
    window.rightHighlight.setAttribute("r", "2.5");
    window.rightHighlight.setAttribute("fill", "#FFFFFF");
    window.catGroup.appendChild(window.rightHighlight);
    
    // ---- НОС ----
    window.nose = document.createElementNS(svgNS, "polygon");
    window.nose.setAttribute("points", "138,228 145,228 141,233");
    window.nose.setAttribute("fill", "#FFB6C1");
    window.nose.setAttribute("stroke", "#222");
    window.nose.setAttribute("stroke-width", "2");
    window.nose.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.nose);
    
    // ---- РОТ ----
    window.mouth = document.createElementNS(svgNS, "path");
    window.mouth.setAttribute("d", "M 134,242 Q 141,248 148,242");
    window.mouth.setAttribute("fill", "none");
    window.mouth.setAttribute("stroke", "#222");
    window.mouth.setAttribute("stroke-width", "2.5");
    window.mouth.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.mouth);
    
    // ---- УСЫ ----
    window.whiskers = document.createElementNS(svgNS, "path");
    window.whiskers.setAttribute("d", "M 100,220 L 55,215 M 100,228 L 55,230 M 176,218 L 220,212 M 176,226 L 220,228");
    window.whiskers.setAttribute("fill", "none");
    window.whiskers.setAttribute("stroke", "#222");
    window.whiskers.setAttribute("stroke-width", "2.5");
    window.whiskers.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.whiskers);
    
    // ---- ПОЛОСКИ НА ЛБУ ----
    const foreheadLines = document.createElementNS(svgNS, "path");
    foreheadLines.setAttribute("d", "M 140,178 L 140,186 M 133,180 L 133,188 M 147,180 L 147,188");
    foreheadLines.setAttribute("fill", "none");
    foreheadLines.setAttribute("stroke", "#222");
    foreheadLines.setAttribute("stroke-width", "2.5");
    foreheadLines.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(foreheadLines);
    
    // ---- ОБЛАЧКО РЕЧИ ----
    window.speechBubble = document.createElementNS(svgNS, "g");
    window.speechBubble.style.display = "none";
    
    const bubbleRect = document.createElementNS(svgNS, "rect");
    bubbleRect.setAttribute("x", "30");
    bubbleRect.setAttribute("y", "80");
    bubbleRect.setAttribute("width", "260");
    bubbleRect.setAttribute("height", "45");
    bubbleRect.setAttribute("rx", "12");
    bubbleRect.setAttribute("fill", "white");
    bubbleRect.setAttribute("stroke", "#222");
    bubbleRect.setAttribute("stroke-width", "2");
    window.speechBubble.appendChild(bubbleRect);
    
    const bubbleTail = document.createElementNS(svgNS, "polygon");
    bubbleTail.setAttribute("points", "125,125 135,140 145,125");
    bubbleTail.setAttribute("fill", "white");
    bubbleTail.setAttribute("stroke", "#222");
    bubbleTail.setAttribute("stroke-width", "2");
    window.speechBubble.appendChild(bubbleTail);
    
    window.speechText = document.createElementNS(svgNS, "text");
    window.speechText.setAttribute("x", "130");
    window.speechText.setAttribute("y", "108");
    window.speechText.setAttribute("text-anchor", "middle");
    window.speechText.setAttribute("font-family", "Arial, sans-serif");
    window.speechText.setAttribute("font-size", "17");
    window.speechText.setAttribute("font-weight", "bold");
    window.speechText.setAttribute("fill", "#222");
    window.speechText.textContent = "Мяу!";
    window.speechBubble.appendChild(window.speechText);
    
    window.catGroup.appendChild(window.speechBubble);
    
    // ---- КАКАШКА ----
    window.poopGroup = document.createElementNS(svgNS, "g");
    window.poopGroup.style.display = "none";
    
    window.poopBottom = document.createElementNS(svgNS, "ellipse");
    window.poopBottom.setAttribute("cx", "185");
    window.poopBottom.setAttribute("cy", "310");
    window.poopBottom.setAttribute("rx", "10");
    window.poopBottom.setAttribute("ry", "8");
    window.poopBottom.setAttribute("fill", "#4a3728");
    window.poopBottom.setAttribute("stroke", "#222");
    window.poopBottom.setAttribute("stroke-width", "2");
    window.poopGroup.appendChild(window.poopBottom);
    
    window.poopTop = document.createElementNS(svgNS, "ellipse");
    window.poopTop.setAttribute("cx", "185");
    window.poopTop.setAttribute("cy", "300");
    window.poopTop.setAttribute("rx", "7");
    window.poopTop.setAttribute("ry", "6");
    window.poopTop.setAttribute("fill", "#4a3728");
    window.poopTop.setAttribute("stroke", "#222");
    window.poopTop.setAttribute("stroke-width", "2");
    window.poopGroup.appendChild(window.poopTop);
    
    window.catGroup.appendChild(window.poopGroup);
    
    window.svg.appendChild(window.catGroup);
    window.catContainer.appendChild(window.svg);
    document.body.appendChild(window.catContainer);
    
    // ========== СТИЛИ ==========
    const style = document.createElement('style');
    style.textContent = `
        .cat-addon {
            position: fixed;
            width: 280px;
            height: 350px;
            z-index: 999999;
            cursor: grab;
            pointer-events: auto;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
            user-select: none;
        }
        .cat-addon.dragging { cursor: grabbing; }
        .cat-svg { width: 100%; height: 100%; display: block; }
    `;
    document.head.appendChild(style);
    
    // Сохраняем координаты для анимаций
    window.normalPose = {
        // Голова
        headCx: 145, headCy: 210, headRx: 52, headRy: 48,
        // Тело
        bodyCx: 145, bodyCy: 285, bodyRx: 38, bodyRy: 35,
        shadowCy: 345,
        
        // ЗАДНИЕ ЛАПЫ (большие, ими ловим и закапываем)
        backLegLeftCx: 115, backLegLeftCy: 325,
        backLegRightCx: 175, backLegRightCy: 325,
        
        // ПЕРЕДНИЕ ЛАПЫ (палочки)
        leftArmX1: 130, leftArmY1: 295, leftArmX2: 125, leftArmY2: 320,
        rightArmX1: 160, rightArmY1: 295, rightArmX2: 165, rightArmY2: 320,
        leftPawCx: 125, leftPawCy: 320,
        rightPawCx: 165, rightPawCy: 320,
        
        // Хвост
        tailD: "M 180,290 Q 230,270 240,230 Q 245,200 230,190",
        
        // Глаза
        leftEyeCx: 120, leftEyeCy: 205, leftEyeRx: 12, leftEyeRy: 14,
        rightEyeCx: 168, rightEyeCy: 203, rightEyeRx: 12, rightEyeRy: 14,
        leftPupilCx: 118, leftPupilCy: 205, leftPupilR: 5,
        rightPupilCx: 166, rightPupilCy: 203, rightPupilR: 5,
        leftHighCx: 115, leftHighCy: 200,
        rightHighCx: 163, rightHighCy: 198,
        
        // Нос и рот
        nosePoints: "138,228 145,228 141,233",
        mouthD: "M 134,242 Q 141,248 148,242",
        whiskersD: "M 100,220 L 55,215 M 100,228 L 55,230 M 176,218 L 220,212 M 176,226 L 220,228",
        
        maxLegLength: 50
    };
    
    console.log('🐱 Кот с большими задними лапами загружен!');
})();