OUTPUT = paint_of_life.zip

default:
	zip -r $(OUTPUT) assets scripts index.html

clean:
	rm $(OUTPUT)
