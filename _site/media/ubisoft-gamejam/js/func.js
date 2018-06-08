function genBackground(scene, level) {

	if(level==1) {
		var geometry = new THREE.BoxGeometry( width, height, 1 );

		var loader = new THREE.TextureLoader();
		loader.setCrossOrigin("Anonymous");

		var materials = [
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl1_bkg.png'),
	           transparent:true
	       })
	    ];
		//var material = new THREE.MeshBasicMaterial( { color: 0xff11aa } );
		var cube = new THREE.Mesh( geometry, materials );
		scene.add( cube );
		cube.position.z = 50;
		cube.position.x = 0;
		cube.position.y = 0;

		var cube = new THREE.Mesh( geometry, materials );
		scene.add( cube );
		cube.position.z = 51;
	}
	if(level==2) {
		//console.log("hereddd");
		var geometry = new THREE.BoxGeometry( width, height, 1 );

		var loader = new THREE.TextureLoader();
		loader.setCrossOrigin("Anonymous");

		var materials = [
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/character_idleL.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl2_bkg.png'),
	           transparent:true
	       })
	    ];
		//var material = new THREE.MeshBasicMaterial( { color: 0xff11aa } );
		var cube = new THREE.Mesh( geometry, materials );
		scene.add( cube );
		cube.position.z = 50;
		cube.position.x = 0;
		cube.position.y = 0;

		var cube = new THREE.Mesh( geometry, materials );
		scene.add( cube );
		cube.position.z = 51;
	}
}

function genPlatforms(scene, level) {
	var geometry, material;
	platforms = [];
	if(level==1 || level == 2 ){

		
		material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true, opacity:0 } );
		
		geometry = new THREE.BoxGeometry( 325.,4., 1 );
		var plat6 = new THREE.Mesh(geometry, material);
		scene.add(plat6);
		plat6.position.z = 45;
		plat6.position.x = -440.;
		plat6.position.y = 145;
		platforms.push(plat6);

		if(level != 2){
			geometry = new THREE.BoxGeometry( 280.,4., 1 );
			var plat7 = new THREE.Mesh(geometry, material);
			scene.add(plat7);
			plat7.position.z = 45;
			plat7.position.x = 270.;
			plat7.position.y = 150;
			platforms.push(plat7);

			geometry = new THREE.BoxGeometry( 70.,4., 1 );
			var plat8 = new THREE.Mesh(geometry, material);
			scene.add(plat8);
			plat8.position.z = 45;
			plat8.position.x = 245.;
			plat8.position.y = 35;
			platforms.push(plat8);

			geometry = new THREE.BoxGeometry( 40.,4., 1 );
			var plat9 = new THREE.Mesh(geometry, material);
			scene.add(plat9);
			plat9.position.z = 45;
			plat9.position.x = 320.;
			plat9.position.y = -100;
			platforms.push(plat9);
		}

		geometry = new THREE.BoxGeometry( 130.,4., 1 );
		var plat10 = new THREE.Mesh(geometry, material);
		scene.add(plat10);
		plat10.position.z = 45;
		plat10.position.x = -450.;
		plat10.position.y = 35;
		platforms.push(plat10);

		geometry = new THREE.BoxGeometry( 10.,4., 1 );
		var plat11 = new THREE.Mesh(geometry, material);
		scene.add(plat11);
		plat11.position.z = 45;
		plat11.position.x = -320.;
		plat11.position.y = -60;
		platforms.push(plat11);

		if(level !=2){
			geometry = new THREE.BoxGeometry( 8.,300, 1 );
			material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true, opacity:0.0 } );
			var plat2 = new THREE.Mesh(geometry, material);
			scene.add(plat2);
			plat2.position.z = 45;
			plat2.position.x = 345;
			plat2.position.y = 2.;
			platforms.push(plat2);

			geometry = new THREE.BoxGeometry( 1.,300, 1 );
			material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true, opacity:0.5} );
			var plat3 = new THREE.Mesh(geometry, material);
			scene.add(plat3);
			plat3.position.z = 45;
			plat3.position.x = 106;
			plat3.position.y = 2.;
			platforms.push(plat3);
		}


		geometry = new THREE.BoxGeometry( 1.,200, 1 );
		material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true, opacity:0.0} );
		var plat4 = new THREE.Mesh(geometry, material);
		scene.add(plat4);
		plat4.position.z = 45;
		plat4.position.x = -309;
		plat4.position.y = 202;
		platforms.push(plat4);

		geometry = new THREE.BoxGeometry( 1.,400, 1 );
		material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true, opacity:0.0} );
		var plat5 = new THREE.Mesh(geometry, material);
		scene.add(plat5);
		plat5.position.z = 45;
		plat5.position.x = -600;
		plat5.position.y = 2.;
		platforms.push(plat5);

	}

	return platforms;
}

function makeSideBars(scene) {
	var geometry = new THREE.BoxGeometry( 10, height/2., 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x223300 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	cube.position.z = 50;
	cube.position.x = width / 4.;
	cube.position.y = height / -4.;

	var geometry2 = new THREE.BoxGeometry(10, height/2., 1);
	var material2 = new THREE.MeshBasicMaterial( { color: 0x223300 } );
	var cube2 = new THREE.Mesh( geometry2, material2 );
	scene.add( cube2 );
	cube2.position.z = 50;
	cube2.position.x = width / -4.;
	cube2.position.y = height / -4.;

	return [cube, cube2];
}

function genCharacter(scene) {
	var geometry = new THREE.BoxGeometry( 80, 130, 1 );
	var loader = new THREE.TextureLoader();
	loader.setCrossOrigin("Anonymous");
	var materials = [
       new THREE.MeshBasicMaterial({
           map: loader.load('images/character_idleL.png'),
           transparent:true
       }),
       new THREE.MeshBasicMaterial({
           map: loader.load('images/character_idleL.png'),
           transparent:true
       }),
       new THREE.MeshBasicMaterial({
           map: loader.load('images/character_idleL.png'),
           transparent:true
       }),
       new THREE.MeshBasicMaterial({
           map: loader.load('images/character_idleL.png'),
           transparent:true
       }),
       new THREE.MeshBasicMaterial({
           map: loader.load('images/character_idleL.png'),
           transparent:true
       }),
       new THREE.MeshBasicMaterial({
           map: loader.load('images/character_walkL.png'),
           transparent:true
       })
    ];
	//var material = new THREE.MeshBasicMaterial( { color: 0xff11aa } );
	var cube = new THREE.Mesh( geometry, materials );
	scene.add( cube );
	cube.position.z = 45;
	cube.position.x = 0;
	cube.position.y = 0;

	return cube;
}

function genFloor(scene) {
	var geometry = new THREE.BoxGeometry( width, 10, 50 );
	var material = new THREE.MeshBasicMaterial( { color: 0xff11aa , transparent: true, opacity:0.0} );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	cube.position.z = 50;
	cube.position.x = 0;
	cube.position.y = height / -2 + 100.;

	return cube;
}

function genWater(scene){
	var geometry = new THREE.BoxGeometry( width, height, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x0e113a , transparent: true, opacity:0.7} );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	cube.position.z = 46;
	cube.position.x = 0;
	cube.position.y = height / -4. - 50;

	return cube;	
}

function inWater(character, water){
	var firstBB = new THREE.Box3().setFromObject(water);
	var	secondBB = new THREE.Box3().setFromObject(character);

	var collision = firstBB.intersectsBox(secondBB);

	if (secondBB.max.y > firstBB.max.y) return 0;

	return collision;
}
function genKey(scene){
		var geometry = new THREE.BoxGeometry( 90, 50, 1 );

		var loader = new THREE.TextureLoader();
		loader.setCrossOrigin("Anonymous");

		var materials = [
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl1_key.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl1_key.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl1_key.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl1_key.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl1_key.png'),
	           transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: loader.load('images/lvl1_key.png'),
	           transparent:true
	       })
	    ];
	    console.log("here");
		//var material = new THREE.MeshBasicMaterial( { color: 0xff11aa } );
		var cube = new THREE.Mesh( geometry, materials );
		scene.add( cube );
		cube.position.z = 46;
		cube.position.x = 500;
		cube.position.y = -200;

		return cube;
}

function hasKey(character, key){
	var firstBB = new THREE.Box3().setFromObject(key);
	var	secondBB = new THREE.Box3().setFromObject(character);

	var collision = firstBB.intersectsBox(secondBB);
	console.log("Here"+collision);

	return collision;
}

function collidesDoor(character){
	var	secondBB = new THREE.Box3().setFromObject(character);

	if(secondBB.min.x < -500 && secondBB.min.y< -150 )
	{
		return true;
	}
	else {
		return false;
	}
}

function onSurface(character, water){
	var firstBB = new THREE.Box3().setFromObject(water);
	var	secondBB = new THREE.Box3().setFromObject(character);

	var collision = firstBB.intersectsBox(secondBB);

	if (collision && secondBB.max.y > firstBB.max.y) return 1;
	else return 0;
}

function onPlatform(character, platforms){

	var trialCharacter = character.clone();
	trialCharacter.position.y -= 1e-3;
	for(var i = 0;i<platforms.length;i++){
		var firstBB = new THREE.Box3().setFromObject(platforms[i]);
		var	secondBB = new THREE.Box3().setFromObject(trialCharacter);

		var collision = firstBB.intersectsBox(secondBB);
		// console.log(firstBB);

		/*var xsign = (firstBB.max.x - secondBB.max.x)*(firstBB.min.x - secondBB.min.x) < 0 ? -1 : 1;
		var ysign = (firstBB.max.y - secondBB.max.y)*(firstBB.min.y - secondBB.min.y) < 0 ? -1 : 1;*/

		if(collision) return collision;
	}	

	return 0;
}

function genDarknessFilter(scene, torch) {

	var filter = new THREE.Shape();
	filter.moveTo( 2*width / -1, 2*height / -1  );
	filter.lineTo( 2*width / -1, 2*height / 1 );
	filter.lineTo( 2*width / 1, 2*height / 1 );
	filter.lineTo( 2*width / 1, 2*height / -1 );
	filter.lineTo( 2*width / -1, 2*height / -1 );

	if(!torch){
		

	    var visionHole = new THREE.Path();
	    var radius = 130;
	    visionHole.moveTo(radius, 0);
	    var step = 2*Math.PI / 100;
	    for(var i = 0;i<=2*Math.PI;i+=step){
	        visionHole.lineTo(radius*Math.cos(i), radius*Math.sin(i));
	    }

	    var lightPatch = new THREE.Shape();
	    lightPatch.moveTo(radius, 0);
	    var step = 2*Math.PI / 100;
	    for(var i = step;i<=2*Math.PI;i+=step){
	        lightPatch.lineTo(radius*Math.cos(i), radius*Math.sin(i));
	    }

	}
	else {

	    var visionHole = new THREE.Path();
	    var a = 10.;
	    var b = 500.;
	    visionHole.moveTo(0, a/2.);
	    visionHole.lineTo(0, -a/2.);
	    visionHole.lineTo(width, -b/2.);
	    visionHole.lineTo(width, b/2.);
	    visionHole.lineTo(0, a/2.);

	    var lightPatch = new THREE.Shape();
	    lightPatch.moveTo(0, a/2.);
	    lightPatch.lineTo(0, -a/2.);
	    lightPatch.lineTo(width, -b/2.);
	    lightPatch.lineTo(width, b/2.);
	    lightPatch.lineTo(0, a/2.);

	    
	}

		filter.holes.push( visionHole );

	    var extrusionSettings = {
	    amount: 1,
	    bevelEnabled: false,
	    material: 0,
	    extrudeMaterial: 1
		};

		var geometry = new THREE.ExtrudeGeometry( filter, extrusionSettings );
		var material = new THREE.MeshBasicMaterial( { color: 0x000000 , transparent: true, opacity:0.99} );
		var filterMesh = new THREE.Mesh( geometry, material );

		geometry = new THREE.ShapeGeometry(lightPatch);
		var lightMaterial = new THREE.MeshBasicMaterial ({color:0xFFA824, transparent:true, opacity:0.3});
		lightMaterial.side = THREE.DoubleSide;
		//material = new THREE.MeshBasicMaterial ({color:0xffff00, transparent:true, opacity:0.5});
		var lightMesh = new THREE.Mesh(geometry, lightMaterial);

		filterMesh.name = "darkness_filter";
		lightMesh.name = "light_on_filter";
		try{scene.remove(scene.getObjectByName("darkness_filter"));	}
		catch(e){}
		try{scene.remove(scene.getObjectByName("light_on_filter"));	}
		catch(e){}
		scene.add( filterMesh );
		scene.add( lightMesh );
		filterMesh.position.z = 48;
		lightMesh.position.z = 48;

		return [filterMesh, lightMesh];
}

function move(character, collidableMeshList, step, direction, flag = 0) {
	var myStep = step;
	var character_clone = character.clone();
	var i;
	if(Math.abs(step)<1e-4)return;

	if(!flag){
			
			if(direction%2)
				character_clone.position.y = character.position.y + myStep;
			else
				character_clone.position.x = character.position.x + myStep;

			for(i = 0;i<collidableMeshList.length;i++){
				var firstBB = new THREE.Box3().setFromObject(collidableMeshList[i]);
				var	secondBB = new THREE.Box3().setFromObject(character_clone);

				var dy = Math.abs(character.position.y - collidableMeshList[i].position.y);
				var dx = Math.abs(character.position.x - collidableMeshList[i].position.x);

				var dy2 = Math.abs(character_clone.position.y - collidableMeshList[i].position.y);
				var dx2 = Math.abs(character_clone.position.x - collidableMeshList[i].position.x);
				var collision = firstBB.intersectsBox(secondBB);

				if(collision){
					break;
				}
			}
			if(i==collidableMeshList.length){
				//console.log(character_clone.position.x);
				character.position.x = character_clone.position.x;
				character.position.y = character_clone.position.y;
			}
			else{
				move(character, collidableMeshList, step/2., direction);
			}
		
	}
	else{
		if(direction%2)
			character.position.y += step;
		else
			character.position.x += step;
	}
	
}

function jump(character){
	characterVelo = 5;

}

function timeIsNow(){
	var currTime = new Date().getTime();
	if(currTime - lastTime > 500){
		lastTime = currTime;
		return 1;
	}
	return 0;
}
