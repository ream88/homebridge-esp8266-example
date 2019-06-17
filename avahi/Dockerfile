FROM alpine:3.9

ARG AVAHI_VERSION=0.7
ARG AVAHI_RELEASE=r1

RUN apk add avahi=$AVAHI_VERSION-$AVAHI_RELEASE

RUN sed -i -r "s/^#enable-dbus=yes/enable-dbus=no/" /etc/avahi/avahi-daemon.conf
RUN rm /etc/avahi/services/*
ADD mqtt.service /etc/avahi/services/

CMD ["avahi-daemon"]
