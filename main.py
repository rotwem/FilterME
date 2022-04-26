# from google.oauth2 import service_account
# credentials = service_account.Credentials.from_service_account_file\
#     (r"C:\Users\romyb\Documents\building_ml\building-romy-7f3553571783.json")
import os
import json
from google.cloud import vision
from google.cloud import storage


os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=r"C:\Users\rotwe\Downloads\ascendant-pad-347008-237d174b5f9d.json"
client_vision = vision.ImageAnnotatorClient()

labels_dict = {
    "dreamer": ["cloud", "sky", "atmosphere", "nature", "natural landscape",
                "landscape", "horizon", "calm", "sunrise", "sunset", "ocean",
                "dawn", "tree", "coast", "reflection", "comfort", "dog", "fur",
                "bed", "nap", "love", "child", "cat", "paw", "plant", "forest",
                "wildlife", "shadow"],
    "social": ["smile", "happy", "interaction", "crowd", "friendship", "fun",
               "event", "party", "public event", "laugh", "entertainment", "drink",
               "night", "midnight", "pub", "food", "cuisine", "finger food",
               "culinary art", "sharing", "conversation", "meeting", "sitting",
               "public space", "tourism", "travel", "cool", "vacation", "festival", "team"],
    "achiever": ["computer", "engineering", "job", "learning", "visual arts",
                    "office equipment", "art", "font", "illustration", "drawing",
                    "graphics", "writing", "book", "paper", "handwriting", "ink",
                    "tool", "document", "desk", "stationery", "laptop", "textile",
                    "pattern", "painting", "bookcase", "artwork", "screenshot", "number"]
}

filters = ["mostly_dreamy_filter", "mostly_social_filter", "mostly_achiever_filter"]


def detect_labels_uri(uri):
    """Detects labels in the file located in Google Cloud Storage or on the
    Web."""
    image = vision.Image()
    image.source.image_uri = uri

    response = client_vision.label_detection(image=image, max_results=50)

    if response.error.message:
        return None

    img_labels = response.label_annotations
    my_grades = {}
    for key in labels_dict.keys():
        my_grades[key] = 0

    for label in img_labels:
        for my_label, google_labels in labels_dict.items():
            my_str = str(label.description).lower()
            if my_str in google_labels:
                my_grades[my_label] += label.score

    highest_grade = 0
    result = ""
    for key, grade in my_grades.items():
        if grade >= highest_grade:
            result = key
            highest_grade = grade

    return result


def classify_img(bucket_name):
    """Lists all the blobs in the bucket."""
    storage_client = storage.Client()
    blobs = storage_client.list_blobs(bucket_name)

    labels_count = {}
    for key in labels_dict.keys():
        labels_count[key] = 0

    count = 0
    for blob in blobs:
        # print(blob.name)
        count += 1
        uri = "gs://" + bucket_name + "/"+str(blob.name)
        result = detect_labels_uri(uri)
        if not result:
            continue
        labels_count[result] += 1
        # if count == 2:
        #     break

    total = sum(labels_count.values())
    mult = 100 / total
    result = {}
    for key, value in labels_count.items():
        result[key] = value * mult

    return result

if __name__ == '__main__':
    for bucket in filters:
        result = classify_img(bucket)
        with open("C:/Users/rotwe/WebstormProjects/untitled/" + bucket + ".json", "w") as outfile:
            json.dump(result, outfile)












