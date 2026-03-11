$modelsDir = "frontend/public/models"
New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null

Write-Host "Downloading model manifests and shards into $modelsDir (face-api.js v0.22.2)"

# Use the release tag that matches installed face-api.js version to avoid shape mismatches
$tag = "v0.22.2"

# face_recognition (2 shards)
Invoke-WebRequest "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/$tag/weights/face_recognition_model-weights_manifest.json" -OutFile "$modelsDir\face_recognition_model-weights_manifest.json"
Invoke-WebRequest "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/$tag/weights/face_recognition_model-shard1" -OutFile "$modelsDir\face_recognition_model-shard1"
Invoke-WebRequest "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/$tag/weights/face_recognition_model-shard2" -OutFile "$modelsDir\face_recognition_model-shard2"

# face_landmark (1 shard)
Invoke-WebRequest "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/$tag/weights/face_landmark_68_model-weights_manifest.json" -OutFile "$modelsDir\face_landmark_68_model-weights_manifest.json"
Invoke-WebRequest "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/$tag/weights/face_landmark_68_model-shard1" -OutFile "$modelsDir\face_landmark_68_model-shard1"

# tiny_face_detector (1 shard)
Invoke-WebRequest "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/$tag/weights/tiny_face_detector_model-weights_manifest.json" -OutFile "$modelsDir\tiny_face_detector_model-weights_manifest.json"
Invoke-WebRequest "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/$tag/weights/tiny_face_detector_model-shard1" -OutFile "$modelsDir\tiny_face_detector_model-shard1"

Write-Host "Download finished."
