plugins {
    java
    id("io.quarkus")
}

repositories {
    mavenCentral()
    mavenLocal()
}

val quarkusPlatformGroupId: String by project
val quarkusPlatformArtifactId: String by project
val quarkusPlatformVersion: String by project

dependencies {
    implementation("io.quarkus:quarkus-security-jpa")
    implementation("io.quarkus:quarkus-security")
    implementation(enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}"))
    implementation("io.quarkus:quarkus-rest")
    implementation("io.quarkus:quarkus-rest-jackson")
    implementation("io.quarkus:quarkus-hibernate-orm-panache")
    implementation("io.quarkiverse.quinoa:quarkus-quinoa:2.5.4")
    implementation("io.quarkus:quarkus-jdbc-postgresql")
    implementation("io.quarkus:quarkus-arc")
    implementation("io.quarkus:quarkus-hibernate-orm")
    testImplementation("io.quarkus:quarkus-junit5")
    testImplementation("io.rest-assured:rest-assured")
    implementation("io.quarkus:quarkus-oidc-client")
}

group = "art"
version = "1.0.0-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}
tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
    options.compilerArgs.add("-parameters")
}

gradle.buildFinished {
    try {
        val process = ProcessBuilder("cmd", "/c", "netstat -ano | findstr :3000")
            .start()
        val output = process.inputStream.bufferedReader().readText()
        
        if (output.isNotEmpty()) {
            val lines = output.lines().filter { it.contains("LISTENING") }
            lines.forEach { line ->
                val pid = line.trim().split("\\s+".toRegex()).last()
                if (pid.isNotEmpty() && pid.matches("\\d+".toRegex())) {
                    println("Killing process $pid on port 3000")
                    ProcessBuilder("cmd", "/c", "taskkill /F /PID $pid")
                        .start()
                        .waitFor()
                }
            }
        }
    } catch (e: Exception) {
        println("Failed to kill process on port 3000: ${e.message}")
    }
}